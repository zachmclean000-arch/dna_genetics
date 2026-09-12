import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import ProductCard from "../components/ProductCard";
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
    <GeneralShop />
  );
}
function GeneralShop() {
  const [params, setParams] = useSearchParams(),
    [products, setProducts] = useState([]),
    [categories, setCategories] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api("/products"), api("/categories")])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);
  const set = (key, value) => {
    const p = new URLSearchParams(params);
    value ? p.set(key, value) : p.delete(key);
    setParams(p);
  };
  const list = products
    .filter(
      (p) =>
        (!params.get("q") ||
          p.name.toLowerCase().includes(params.get("q").toLowerCase())) &&
        (!params.get("category") || p.category === params.get("category")) &&
        (!params.get("attribute") ||
          [p.strainType, ...(p.traits || [])].includes(
            params.get("attribute"),
          )) &&
        (!params.get("collection") || p[params.get("collection")]) &&
        (!params.get("stock") || p.stock > 0),
    )
    .sort((a, b) =>
      params.get("sort") === "price-asc"
        ? (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
        : params.get("sort") === "price-desc"
          ? (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
          : a.name.localeCompare(b.name),
    );
  return (
    <section className="section">
      <p className="eyebrow">THE DNA COLLECTION</p>
      <h1>Shop the archive.</h1>
      <p>
        Sample prices and inventory. This catalogue is an educational school
        project.
      </p>
      <div className="filters">
        <label>
          Search
          <input
            value={params.get("q") || ""}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Search products"
          />
        </label>
        <label>
          Category
          <select
            value={params.get("category") || ""}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Sort by
          <select
            value={params.get("sort") || ""}
            onChange={(e) => set("sort", e.target.value)}
          >
            <option value="">Name A–Z</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={!!params.get("stock")}
            onChange={(e) => set("stock", e.target.checked ? "1" : "")}
          />{" "}
          In stock
        </label>
        <button onClick={() => setParams({})}>Clear filters</button>
      </div>
      <p aria-live="polite">
        {loading ? "Loading catalogue…" : `${list.length} products`}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="product-grid">
        {list.map((p) => (
          <ProductCard product={p} key={p.id} />
        ))}
      </div>
      {!loading && !list.length && <p>No products match these filters.</p>}
    </section>
  );
}
