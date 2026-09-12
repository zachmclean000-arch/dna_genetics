export const seedCollections = {
  bestSeller: "Best Cannabis Seeds",
  featured: "Classic Strains",
  newArrival: "New Strains",
  mixPacks: "Mix Packs",
  cheapSeeds: "Cheap Weed Seeds",
};

export function collectionKey(params) {
  const key = params.get("collection");
  if (Object.hasOwn(seedCollections, key)) return key;
  if (params.get("attribute") === "Mix Packs") return "mixPacks";
  if (
    !key &&
    !params.get("attribute") &&
    !params.get("category") &&
    !params.get("q") &&
    params.get("sort") === "price-asc"
  )
    return "cheapSeeds";
  return "";
}
