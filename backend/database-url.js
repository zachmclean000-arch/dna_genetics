import "./config.js";

export function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const url = new URL("postgresql://localhost");
  url.hostname = process.env.PGHOST || "localhost";
  url.port = process.env.PGPORT || "5432";
  url.username = process.env.PGUSER || "postgres";
  url.password = process.env.PGPASSWORD || "";
  url.pathname = `/${process.env.PGDATABASE || "dna_genetics"}`;
  return url.toString();
}
