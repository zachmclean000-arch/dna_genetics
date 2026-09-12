import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { databaseUrl } from "./database-url.js";

export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl(), connectionTimeoutMillis: 5000 }),
});
