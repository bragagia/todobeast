import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { PullResponse } from "replicache";
import { z } from "zod";
import {
  getChangedEntries,
  getChangedLastMutationIDs,
  getClientGroup,
  getSpaceVersion,
} from "../../../../src/backend/data";
import { tx } from "../../../../src/backend/pg";

const pullRequestSchema = z.object({
  clientGroupID: z.string(),
  cookie: z.union([z.number(), z.null()]),
});

type PullRequest = z.infer<typeof pullRequestSchema>;

const authError = {};

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
    `PULL received`,
    dayjs().toISOString(),
    JSON.stringify(requestBody, null, "")
  );

  const pullRequest = pullRequestSchema.parse(requestBody);

  let pullResponse: PullResponse;
  try {
    pullResponse = await processPull(pullRequest, user.id);
  } catch (e) {
    if (e === authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      console.error("Error processing pull:", e);

      return NextResponse.error();
    }
  }

  console.log("PULL end success", dayjs().toISOString());

  return NextResponse.json(pullResponse);
}

async function processPull(req: PullRequest, userID: string) {
  const { clientGroupID, cookie: requestCookie } = req;

  const t0 = Date.now();

  const [entries, lastMutationIDChanges, responseCookie] = await tx(
    async (executor) => {
      const clientGroup = await getClientGroup(executor, req.clientGroupID);
      if (clientGroup && clientGroup.userID !== userID) {
        throw authError;
      }

      return Promise.all([
        getChangedEntries(executor, requestCookie ?? 0, userID),
        getChangedLastMutationIDs(executor, clientGroupID, requestCookie ?? 0),
        getSpaceVersion(executor, userID), // Use userId as spaceID for now
      ]);
    }
  );

  console.log("lastMutationIDChanges: ", lastMutationIDChanges);
  console.log("responseCookie: ", responseCookie);
  console.log("Read all objects in", Date.now() - t0);

  // TODO: Return ClientStateNotFound for Replicache 13 to handle case where server state deleted.

  const res: PullResponse = {
    lastMutationIDChanges,
    cookie: responseCookie,
    patch: [],
  };

  for (const [key, value, deleted] of entries) {
    if (deleted) {
      res.patch.push({
        op: "del",
        key,
      });
    } else {
      res.patch.push({
        op: "put",
        key,
        value,
      });
    }
  }

  console.log(`Returning`, JSON.stringify(res, null, ""));
  return res;
}
