export const cataloguePaths = {
  "Feminized Seeds": "/shop/feminized-seeds",
  "Autoflower Seeds": "/shop/autoflower-seeds",
  "Regular Seeds": "/shop/regular-seeds",
  Indica: "/shop/indica-seeds",
  Sativa: "/shop/sativa-seeds",
  Hybrid: "/shop/hybrid-seeds",
  Indoor: "/shop/indoor-seeds",
  "High Yield": "/shop/high-yield-seeds",
  "High THC": "/shop/high-thc-seeds",
  "Beginner-Friendly": "/shop/beginner-friendly-seeds",
  "Fast-Flowering": "/shop/fast-flowering-seeds",
  Medicinal: "/shop/medicinal-seeds",
  Outdoor: "/shop/outdoor-seeds",
  "High CBD": "/shop/high-cbd-seeds",
  bestSeller: "/shop/best-cannabis-seeds",
  featured: "/shop/classic-strains",
  newArrival: "/shop/new-strains",
  mixPacks: "/shop/mix-packs",
  cheapSeeds: "/shop/cheap-weed-seeds",
};

export const catalogueViews = {
  "feminized-seeds": { category: "Feminized Seeds" },
  "autoflower-seeds": { category: "Autoflower Seeds" },
  "regular-seeds": { category: "Regular Seeds" },
  "indica-seeds": { genetics: "Indica" },
  "sativa-seeds": { genetics: "Sativa" },
  "hybrid-seeds": { genetics: "Hybrid" },
  "indoor-seeds": { trait: "Indoor" },
  "high-yield-seeds": { trait: "High Yield" },
  "high-thc-seeds": { trait: "High THC" },
  "beginner-friendly-seeds": { trait: "Beginner-Friendly" },
  "fast-flowering-seeds": { trait: "Fast-Flowering" },
  "medicinal-seeds": { trait: "Medicinal" },
  "outdoor-seeds": { trait: "Outdoor" },
  "high-cbd-seeds": { trait: "High CBD" },
  "best-cannabis-seeds": { curated: "bestSeller" },
  "classic-strains": { curated: "featured" },
  "new-strains": { curated: "newArrival" },
  "mix-packs": { curated: "mixPacks" },
  "cheap-weed-seeds": { curated: "cheapSeeds", sort: "price-asc" },
};

export function searchPath(query) {
  return `/shop/search/${encodeURIComponent(
    query.trim().toLowerCase().replaceAll(/\s+/g, "-"),
  )}`;
}
