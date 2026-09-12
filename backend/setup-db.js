import "./config.js";
import pg from "pg";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { databaseUrl } from "./database-url.js";

const require = createRequire(import.meta.url);
const cwd = fileURLToPath(new URL(".", import.meta.url));

async function setup() {
  const target = new URL(databaseUrl());
  if (!target.password) {
    throw new Error("Set PGPASSWORD in backend/.env (or a complete DATABASE_URL), then rerun npm run db:setup. Do not share the password in chat.");
  }
  const name = decodeURIComponent(target.pathname.slice(1));
  if (!name) throw new Error("A database name is required.");
  const adminUrl = new URL(target);
  adminUrl.pathname = "/postgres";
  const client = new pg.Client({ connectionString: adminUrl.toString(), connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    const existing = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [name]);
    if (!existing.rowCount) {
      await client.query(`CREATE DATABASE "${name.replaceAll('"', '""')}"`);
      console.log(`Created database: ${name}`);
    } else console.log(`Using existing database: ${name}`);
  } finally { await client.end(); }

  const cli = require.resolve("prisma/build/index.js");
  for (const args of [["generate"], ["migrate", "deploy"]]) {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd, stdio: "inherit" });
    if (result.error || result.status !== 0) throw new Error(`Prisma ${args.join(" ")} failed.`);
  }
  const { prisma } = await import("./prisma-client.js");
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("PostgreSQL + Prisma connection verified. Start the API with npm run dev from backend.");
  } finally { await prisma.$disconnect(); }
}

setup().catch(error => {
  // Connection errors can contain credentials: show only known safe details.
  if (error.code === "28P01") console.error("PostgreSQL rejected the password. Check backend/.env.");
  else if (error.code === "ECONNREFUSED") console.error("PostgreSQL is not accepting connections. Check its service, host and port.");
  else if (error.code) console.error(`Database setup failed (${error.code}). Check the database connection and permissions.`);
  else console.error(error.message.replace(/postgres(?:ql)?:\/\/\S+/gi, "[database URL hidden]"));
  process.exitCode = 1;
});
