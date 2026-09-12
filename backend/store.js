import "./config.js";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readCatalogue, saveCatalogue } from "./catalogue-store.js";
const names = [
  "Purple Chocolope",
  "Chocolope",
  "Strawberry Banana",
  "Bruised Bananas",
  "Blue Dream",
  "White Widow",
  "GG4",
  "Skywalker Kush",
];
export const seed = () => ({
  products: names.map((name, i) => ({
    id: crypto.randomUUID(),
    name,
    slug: name.toLowerCase().replaceAll(" ", "-"),
    sku: `DNA-${i + 1}`,
    price: 79.95 + i,
    salePrice: null,
    category: i % 3 === 0 ? "Regular Seeds" : "Feminized Seeds",
    strainType: i % 2 ? "Sativa" : "Hybrid",
    description:
      "Sample catalogue entry for this educational interface. All prices, inventory and orders are simulated.",
    shortDescription: "DNA archive · educational catalogue",
    genetics: "Sample data",
    thc: "",
    floweringTime: "",
    yield: "",
    stock: 20,
    status: "active",
    images: ["/assets/images/products/seed-pack.svg"],
    featured: i < 4,
    bestSeller: i > 3,
    newArrival: i < 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  categories: ["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"],
  users: [],
  sessions: [],
  orders: [],
  subscribers: [],
  reviews: [],
});
let prisma, db;
const useSqlite =
  process.env.DNA_GENETICS_DB_PATH === ":memory:" ||
  process.env.DB_CLIENT === "sqlite";
if (!useSqlite) {
  ({ prisma } = await import("./prisma-client.js"));
  await prisma.storeState.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, data: seed() },
  });
  console.log("Database: PostgreSQL connected through Prisma.");
} else {
  const { DatabaseSync } = await import("node:sqlite");
  mkdirSync(fileURLToPath(new URL("./data/", import.meta.url)), {
    recursive: true,
  });
  db = new DatabaseSync(
    process.env.DNA_GENETICS_DB_PATH ||
      fileURLToPath(new URL("./data/dna_genetics.sqlite", import.meta.url)),
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS dna_genetics_state (id INTEGER PRIMARY KEY, data TEXT NOT NULL)",
  );
  db.prepare("INSERT OR IGNORE INTO dna_genetics_state VALUES (1,?)").run(
    JSON.stringify(seed()),
  );
  console.log(
    `Database: SQLite (${process.env.DNA_GENETICS_DB_PATH || "backend/data/dna_genetics.sqlite"}).`,
  );
}
let pending = Promise.resolve();
export function transaction(fn) {
  const task = pending.then(async () => {
    if (prisma) {
      return prisma.$transaction(
        async (client) => {
          const rows =
            await client.$queryRaw`SELECT data FROM dna_genetics_state WHERE id=1 FOR UPDATE`;
          const state = rows[0].data;
          if (!state.relationalCatalogue) {
            await saveCatalogue(
              client,
              { products: [], categories: [] },
              {
                products: state.products || [],
                categories: state.categories || [],
              },
            );
            state.relationalCatalogue = true;
          }
          const before = await readCatalogue(client);
          state.products = structuredClone(before.products);
          state.categories = [...before.categories];
          const result = await fn(state);
          await saveCatalogue(client, before, state);
          delete state.products;
          delete state.categories;
          await client.storeState.update({
            where: { id: 1 },
            data: { data: JSON.parse(JSON.stringify(state)) },
          });
          return result;
        },
        { timeout: 30000 },
      );
    }
    db.exec("BEGIN IMMEDIATE");
    try {
      const state = JSON.parse(
        db.prepare("SELECT data FROM dna_genetics_state WHERE id=1").get().data,
      );
      const result = await fn(state);
      db.prepare("UPDATE dna_genetics_state SET data=? WHERE id=1").run(
        JSON.stringify(state),
      );
      db.exec("COMMIT");
      return result;
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  });
  pending = task.catch(() => {});
  return task;
}
