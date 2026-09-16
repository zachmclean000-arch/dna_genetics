import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api, money } from "../../services/api";
import autoflowerArticle from "../../data/autoflowerArticle.json";
import { seedCollections } from "../../data/seedCollections";
import { cataloguePaths, searchPath } from "../../data/catalogueRoutes";
import "./SeedCatalogue.css";

export function SeedCard({ product }) {
  const [open, setOpen] = useState(false);
  const values = product.variants?.length
    ? product.variants.map((v) => v.salePrice ?? v.price)
    : [product.salePrice ?? product.price];
  const low = Math.min(...values),
    high = Math.max(...values);
  return (
    <article className="dna-seed-card">
      <Link to={`/product/${product.slug}`}>
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <h2>{product.name}</h2>
      </Link>
      <p className="dna-seed-price">
        {money(low)}
        {high !== low && <> – {money(high)}</>}
      </p>
      <div className="dna-seed-actions">
        {product.variants?.length ? (
          <button
            aria-expanded={open}
            aria-controls={`sizes-${product.id}`}
            onClick={() => setOpen(!open)}
          >
            View Sizes
          </button>
        ) : (
          <Link to={`/product/${product.slug}`}>View Product</Link>
        )}
        <Link to={`/product/${product.slug}`}>
          Buy Now <span aria-hidden="true">▾</span>
        </Link>
      </div>
      {open && product.variants?.length > 0 && (
        <ul
          className="dna-seed-size-list"
          id={`sizes-${product.id}`}
          aria-label={`${product.name} pack sizes`}
        >
          {product.variants?.map((v) => (
            <li key={v.id}>
              <Link to={`/product/${product.slug}/${v.size}-seeds`}>
                <strong>{v.size}x</strong> {money(v.salePrice ?? v.price)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function SeedCategory({
  category = "Feminized Seeds",
  genetics = "",
  trait = "",
  curated = "",
  search = "",
  initialSort = "",
}) {
  const titles = {
    "Feminized Seeds": "Feminized Cannabis (Marijuana) Seeds",
    "Autoflower Seeds": "Autoflower Seeds",
    "Regular Seeds":
      "Regular Cannabis Seeds: Grow Your Own High-Quality Cannabis",
  };
  const title = curated
    ? seedCollections[curated]
    : trait
      ? `${trait} Seeds`
      : genetics
        ? `${genetics} Seeds`
        : titles[category] || category || "Shop All Seeds";
  const collection = (
    trait ||
    genetics ||
    category.replace(" Seeds", "") ||
    "all"
  ).toLowerCase();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(search || params.get("q") || "");
  const [products, setProducts] = useState([]),
    [categories, setCategories] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    setSearchTerm(search || params.get("q") || "");
  }, [search, params]);
  useEffect(() => {
    let active = true;
    Promise.all([api("/products"), api("/categories")])
      .then(([p, c]) => {
        if (active) {
          setProducts(p);
          setCategories(
            c.filter((name) =>
              ["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].includes(
                name,
              ),
            ),
          );
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const order = params.get("sort") || initialSort || "latest";
  const filtered = products
    .filter(
      (p) =>
        (!searchTerm ||
          p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) &&
        (!params.get("stock") || p.stock > 0) &&
        (!category ||
          p.category === category ||
          p.additionalCategories?.includes(category)) &&
        (!genetics || p.strainType === genetics) &&
        (!curated ||
          p.additionalCategories?.includes(seedCollections[curated])) &&
        (!trait || p.additionalCategories?.includes(`${trait} Seeds`)),
    )
    .sort((a, b) => {
      const price = (p) =>
        Math.min(
          ...(p.variants?.length
            ? p.variants.map((v) => v.salePrice ?? v.price)
            : [p.salePrice ?? p.price]),
        );
      return order === "price-asc"
        ? price(a) - price(b)
        : order === "price-desc"
          ? price(b) - price(a)
          : order === "name"
            ? a.name.localeCompare(b.name)
            : new Date(b.createdAt) - new Date(a.createdAt);
    });
  const pages = Math.max(1, Math.ceil(filtered.length / 16));
  const requested = Number(params.get("page")) || 1;
  const page = Math.min(pages, Math.max(1, Math.floor(requested)));
  const visible = filtered.slice((page - 1) * 16, page * 16);
  const change = (key, value) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  };
  return (
    <div className="dna-seed-page">
      <section className="dna-seed-banner">
        <h1>{title}</h1>
        <p>
          {curated
            ? `Explore our ${title.toLowerCase()} collection.`
            : collection === "all"
              ? "Explore the complete DNA Genetics seed collection."
              : `Explore the DNA Genetics ${collection} seed collection.`}
          <br />
          Compare varieties and pack sizes below.
        </p>
      </section>
      <div className="dna-seed-container">
        <nav className="dna-seed-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          {(category || genetics || trait || curated) && (
            <>
              <Link to="/shop">Shop</Link>
              <span>›</span>
            </>
          )}
          <span aria-current="page">{title}</span>
        </nav>
        {!category && !genetics && !trait && !curated && (
          <form
            className="dna-shop-search"
            onSubmit={(event) => {
              event.preventDefault();
              navigate(searchTerm.trim() ? searchPath(searchTerm) : "/shop");
            }}
          >
            <label htmlFor="shop-search">Search seeds</label>
            <input
              id="shop-search"
              type="search"
              value={searchTerm}
              placeholder="Search by name"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button type="submit">Search</button>
            {(searchTerm || params.get("stock")) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  navigate("/shop");
                }}
              >
                Clear filters
              </button>
            )}
          </form>
        )}
        <div className="dna-seed-toolbar">
          <p role="status">
            {loading
              ? "Loading products…"
              : filtered.length
                ? filtered.length <= 16
                  ? `Showing all ${filtered.length} results`
                  : `Showing ${(page - 1) * 16 + 1}–${Math.min(page * 16, filtered.length)} of ${filtered.length} results`
                : "No products found"}
          </p>
          <select
            aria-label="Sort products"
            value={order}
            onChange={(e) => change("sort", e.target.value)}
          >
            <option value="latest">Sort by latest</option>
            <option value="name">Sort by name</option>
            <option value="price-asc">Sort by price: low to high</option>
            <option value="price-desc">Sort by price: high to low</option>
          </select>
          <select
            aria-label="Product category"
            value={category}
            onChange={(e) => {
              navigate(
                e.target.value ? cataloguePaths[e.target.value] : "/shop",
              );
            }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {error && <p role="alert">Unable to load products: {error}</p>}
        <div className="dna-seed-grid">
          {visible.map((p) => (
            <SeedCard key={p.id} product={p} />
          ))}
        </div>
        {pages > 1 && (
          <nav className="dna-seed-pagination" aria-label="Product pages">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                aria-current={page === i + 1 ? "page" : undefined}
                onClick={() => {
                  change("page", String(i + 1));
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                {i + 1}
              </button>
            ))}
            {page < pages && (
              <button
                aria-label="Next page"
                onClick={() => {
                  change("page", String(page + 1));
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                →
              </button>
            )}
          </nav>
        )}
        {category === "Autoflower Seeds" && !genetics && !trait && !curated ? (
          <article
            className="dna-seed-information dna-autoflower-article"
            aria-label="About autoflower cannabis seeds"
          >
            {autoflowerArticle.map(({ tag: Tag, text }, index) => (
              <Tag key={index}>{text}</Tag>
            ))}
          </article>
        ) : (
          <section className="dna-seed-information">
            <h2>{title}</h2>
            {collection !== "vape" && (
              <p>
                This collection brings together the {collection} varieties in
                our catalogue. Select a product to see its listed parentage,
                available pack sizes and prices.
              </p>
            )}
            <h2>Frequently asked questions</h2>
            <details>
              <summary>Which pack sizes are available?</summary>
              <p>
                Options vary by product. Use View Sizes to see the packs
                recorded for that variety.
              </p>
            </details>
            <details>
              <summary>Where can I find product details?</summary>
              <p>
                Select a product image or name to open its details and compare
                individual pack prices.
              </p>
            </details>
          </section>
        )}
      </div>
    </div>
  );
}
