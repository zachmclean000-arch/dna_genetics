import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import SeedCategory from "./FeminizedSeeds";
import { collectionKey } from "../../data/seedCollections";
import { catalogueViews } from "../../data/catalogueRoutes";
export default function Shop() {
  const { catalogueSlug, query } = useParams();
  const [params] = useSearchParams();
  const view = catalogueViews[catalogueSlug] || {};
  const category = view.category || params.get("category");
  const genetics = view.genetics || params.get("attribute");
  const trait = view.trait || "";
  const curated = view.curated || collectionKey(params);
  const search = query
    ? decodeURIComponent(query).replaceAll("-", " ")
    : params.get("q") || "";
  if (curated)
    return (
      <SeedCategory
        key={`${curated}-${category}`}
        category={category || ""}
        curated={curated}
        initialSort={view.sort}
        search={search}
      />
    );
  if (trait)
    return (
      <SeedCategory
        key={`${trait}-${category}`}
        category={category || ""}
        trait={trait}
        search={search}
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
        search={search}
      />
    );
  if (["Indica", "Sativa", "Hybrid"].includes(genetics))
    return (
      <SeedCategory
        key={`${genetics}-${category}`}
        category={category || ""}
        genetics={genetics}
        search={search}
      />
    );
  return ["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].includes(
    category,
  ) ? (
    <SeedCategory key={category} category={category} search={search} />
  ) : (
    <SeedCategory category={category || ""} search={search} />
  );
}
