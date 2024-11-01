import { Executor } from "./pg";

export async function createDatabase(t: Executor) {
  if (await schemaExists(t)) {
    return;
  }
  console.log("creating database");
  await createSchemaVersion1(t);
}

export async function createSchemaVersion1(t: Executor) {
  // Replicache space
  await t.none(`create table replicache_space (
    id uuid not null,
    version integer not null,

    constraint replicache_space_pkey primary key (id),
    constraint replicache_space_id_fkey foreign key (id) references auth.users (id) on delete cascade
  )`);

  // Replicache client group
  await t.none(`create table replicache_client_group (
    id text not null,
    user_id uuid not null,

    constraint replicache_client_group_pkey primary key (id),
    constraint replicache_client_group_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  )`);

  // Replicache client
  await t.none(`create table replicache_client (
    id text not null,
    client_group_id text not null,
    last_mutation_id integer not null,
    last_modified_version integer not null,

    constraint replicache_client_pkey primary key (id),
    constraint replicache_client_client_group_id_fkey foreign key (client_group_id) references replicache_client_group (id) on delete cascade
  )`);
  await t.none(
    `create index on replicache_client (client_group_id, last_modified_version)`
  );

  // Replicache entry
  await t.none(`create table entry (
    key text not null,
    space_id uuid not null,
    value jsonb not null,
    deleted boolean not null,
    last_modified_version integer not null,

    constraint entry_pkey primary key (key),
    constraint entry_space_id_fkey foreign key (space_id) references replicache_space (id) on delete cascade
  )`);

  await t.none(`create unique index key_space on entry (key, space_id)`);
  await t.none(`create index on entry (deleted)`);
  await t.none(`create index on entry (last_modified_version)`);
  await t.none(`create index on entry (space_id)`);

  // We are going to be using the supabase realtime api from the client to
  // receive pokes. This requires js access to db. We use RLS to restrict this
  // access to only what is needed: read access to the space table. All this
  // gives JS is the version of the space which is harmless. Everything else is
  // auth'd through cookie auth using normal web application patterns.
  await t.none(`alter table replicache_space enable row level security`);
  await t.none(`alter table replicache_client_group enable row level security`);
  await t.none(`alter table replicache_client enable row level security`);
  await t.none(`alter table entry enable row level security`);
  await t.none(`create policy read_access_to_space_owner on replicache_space
      as PERMISSIVE for select to authenticated using (auth.uid() = id)`);

  // Here we enable the supabase realtime api and monitor updates to the
  // replicache_space table.
  await t.none(`alter publication supabase_realtime
    add table replicache_space`);
  await t.none(`alter publication supabase_realtime set
    (publish = 'update');`);
}

async function schemaExists(t: Executor): Promise<number> {
  const spaceExists = await t.one(`select exists(
      select from pg_tables where schemaname = 'public'
      and tablename = 'replicache_space')`);
  return spaceExists.exists;
}
