import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ReplicacheTransaction } from "replicache-transaction";
import { z } from "zod";
import {
  Client,
  createClient,
  createClientGroup,
  createSpaceVersion,
  getClient,
  getClientGroup,
  getSpaceVersion,
  setSpaceVersion,
  updateClient,
} from "../../../../src/backend/data";
import { Executor, tx } from "../../../../src/backend/pg";
import { PostgresStorage } from "../../../../src/backend/postgres-storage";
import { ReplicacheMutators } from "../../../../src/db/mutators";
import dayjs from "dayjs";

const mutationSchema = z.object({
  id: z.number(),
  clientID: z.string(),
  name: z.string(),
  args: z.any(),
});

const pushRequestSchema = z.object({
  clientGroupID: z.string(),
  mutations: z.array(mutationSchema),
});

const authError = {};
const clientStateNotFoundError = {};

type PushRequest = z.infer<typeof pushRequestSchema>;

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;

  if (error || !user || user.id === "") {
    if (error) {
      console.log("Error while fetching user data: ", error);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let requestBody = await request.json();
  console.log(
    "PUSH received",
    dayjs().toISOString(),
    JSON.stringify(requestBody, null, "")
  );

  const push = pushRequestSchema.parse(requestBody);

  try {
    await processPush(push, user.id);
  } catch (e) {
    switch (e) {
      case authError:
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      case clientStateNotFoundError:
        return NextResponse.json(
          { error: "ClientStateNotFound" },
          { status: 401 }
        );

      default:
        console.error("Error processing push:", e);
        return NextResponse.error();
    }
  }

  console.log("PUSH end success", dayjs().toISOString());

  return NextResponse.json({ status: "OK" });
}

async function processPush(push: PushRequest, userID: string) {
  const t0 = Date.now();
  // Batch all mutations into one transaction. ReplicacheTransaction caches
  // reads and changes in memory, we will flush them all together at end of tx.
  await tx(async (executor) => {
    const clientGroup = await ensureClientGroup(
      executor,
      push.clientGroupID,
      userID
    );

    // Since all mutations within one transaction, we can just increment the
    // global version once.
    let prevVersion = await getSpaceVersion(executor, userID);
    if (!prevVersion) {
      await createSpaceVersion(executor, userID, 0);
      prevVersion = 0;
    }
    const nextVersion = prevVersion + 1;

    console.log("nextVersion: ", nextVersion);

    const storage = new PostgresStorage(nextVersion, executor, userID);
    const tx = new ReplicacheTransaction(storage);
    const clients = new Map<string, Client>();

    for (let i = 0; i < push.mutations.length; i++) {
      const mutation = push.mutations[i];
      const { id, clientID } = mutation;

      let client = clients.get(clientID);
      if (client === undefined) {
        client = await ensureClient(
          executor,
          clientID,
          clientGroup.id,
          nextVersion,
          id
        );
        clients.set(clientID, client);
      }

      const expectedMutationID = client.lastMutationID + 1;

      if (id < expectedMutationID) {
        console.log(`Mutation ${id} has already been processed - skipping`);
        continue;
      }

      if (id > expectedMutationID) {
        throw new Error(
          `Mutation ${id} is from the future. Perhaps the server state was deleted? ` +
            `If so, clear application storage in browser and refresh.`
        );
      }

      console.log("Processing mutation:", JSON.stringify(mutation, null, ""));

      const t1 = Date.now();
      /// TODO: rule not working eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mutator = (ReplicacheMutators as any)[mutation.name];
      if (!mutator) {
        console.error(`Unknown mutator: ${mutation.name} - skipping`);
      }

      try {
        await mutator(tx, mutation.args);
      } catch (e) {
        console.error(
          `Error executing mutator: ${JSON.stringify(mutator)}: ${e}`
        );
      }

      client.lastMutationID = expectedMutationID;
      client.lastModifiedVersion = nextVersion;
      console.log("Processed mutation in", Date.now() - t1);
    }

    await Promise.all([
      Array.from(clients.values()).map((c) => updateClient(executor, c)),
      setSpaceVersion(executor, userID, nextVersion),
      tx.flush(),
    ]);

    // No need to explicitly poke, Supabase realtime stuff will fire a change
    // because the space table changed.
  });

  console.log("Processed all mutations in", Date.now() - t0);
}

async function ensureClientGroup(
  executor: Executor,
  id: string,
  userID: string
) {
  const clientGroup = await getClientGroup(executor, id);
  if (clientGroup) {
    // Users can only access their own groups.
    if (clientGroup.userID !== userID) {
      throw authError;
    }
    return clientGroup;
  }

  return await createClientGroup(executor, id, userID);
}

async function ensureClient(
  executor: Executor,
  id: string,
  clientGroupID: string,
  lastModifiedVersion: number,
  mutationID: number
): Promise<Client> {
  const c = await getClient(executor, id);
  if (c) {
    // If this client isn't from clientGroup we've auth'd, then user cannot
    // access it.
    if (c.clientGroupID !== clientGroupID) {
      throw authError;
    }
    return c;
  }

  // If mutationID isn't 1, then this isn't a new client. We should have found
  // the client record.
  if (mutationID !== 1) {
    throw clientStateNotFoundError;
  }

  return await createClient(executor, id, clientGroupID, lastModifiedVersion);
}
