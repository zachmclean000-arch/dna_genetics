import "./config.js";
import { readFileSync } from "node:fs";
import { prisma } from "./prisma-client.js";
import { readCatalogue, saveCatalogue } from "./catalogue-store.js";

const version = 1;
const catalogue = JSON.parse(
  readFileSync(new URL("./catalogue-seed.json", import.meta.url), "utf8"),
);

await prisma.$transaction(
  async (client) => {
    const record = await client.storeState.findUnique({ where: { id: 1 } });
    if (!record) throw Error("Store state is missing. Apply migrations first.");
    const state = record.data;
    if (state.catalogueSeedVersion === version) {
      console.log(`Catalogue seed ${version} is already installed.`);
      return;
    }

    const before = await readCatalogue(client);
    await saveCatalogue(client, before, catalogue);
    state.relationalCatalogue = true;
    state.catalogueSeedVersion = version;
    await client.storeState.update({
      where: { id: 1 },
      data: { data: JSON.parse(JSON.stringify(state)) },
    });
    console.log(
      `Installed catalogue seed ${version}: ${catalogue.products.length} products and ${catalogue.categories.length} categories.`,
    );
  },
  { timeout: 120000 },
);

await prisma.$disconnect();
