import React from "react";
import { useSearchParams } from "react-router-dom";
import SeedCategory from "./FeminizedSeeds";
import { collectionKey } from "../../data/seedCollections";
export default function Shop() {
  const [params] = useSearchParams();
  const category = params.get("category");
  const genetics = params.get("attribute");
  const curated = collectionKey(params);
  if (curated)
    return (
      <SeedCategory
        key={`${curated}-${category}`}
        category={category || ""}
        curated={curated}
      />
    );
  if (
    [
      "Indoor",
      "High Yield",
      "High THC",
      "Beginner-Friendly",
      "Fast-Flowering",
      "Medicinal",
      "Outdoor",
      "High CBD",
    ].includes(genetics)
  )
    return (
      <SeedCategory
        key={`${genetics}-${category}`}
        category={category || ""}
        trait={genetics}
      />
    );
  if (["Indica", "Sativa", "Hybrid"].includes(genetics))
    return (
      <SeedCategory
        key={`${genetics}-${category}`}
        category={category || ""}
        genetics={genetics}
      />
    );
  return ["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].includes(
    category,
  ) ? (
    <SeedCategory key={category} category={category} />
  ) : (
    <SeedCategory category={category || ""} />
  );
}
