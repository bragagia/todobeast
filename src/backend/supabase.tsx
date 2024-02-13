export function getProjectURL() {
  return getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL"
  );
}

export function getAPIKey() {
  return getEnvVar(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export function getConnectionString() {
  return process.env.SUPABASE_DATABASE_CONNECTION_STRING!.replace(
    "PASSWORD",
    encodeURIComponent(getDBPass())
  );
}

function getDBPass() {
  return getEnvVar(
    process.env.SUPABASE_DATABASE_PASSWORD,
    "SUPABASE_DATABASE_PASSWORD"
  );
}

function getEnvVar(v: string | undefined, n: string) {
  if (!v) {
    throw new Error(`Required env var '${n}' was not set`);
  }
  return v;
}
