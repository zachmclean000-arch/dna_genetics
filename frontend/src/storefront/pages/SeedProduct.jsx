import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { money } from "../../services/api";
import { SeedCard } from "./FeminizedSeeds";
import "./SeedProduct.css";
import { useApp } from "../../hooks/context";

export default function SeedProduct({ product: p, related }) {
  const { add } = useApp();
  const [added, setAdded] = useState(null);
  const [params] = useSearchParams();
  const [size, setSize] = useState(
    Number(params.get("size")) || p.variants[0].size,
  );
  const [image, setImage] = useState(p.images[0]);
  const [tab, setTab] = useState("Description");
  const selected = p.variants.find((v) => v.size === size) || p.variants[0];
  return (
    <div className="dna-seed-page">
      <div className="dna-seed-container">
        <nav className="dna-seed-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/shop?category=${encodeURIComponent(p.category)}`}>
            {p.category}
          </Link>
          <span>›</span>
          <span aria-current="page">{p.name}</span>
        </nav>
        <div className="dna-seed-detail">
          <div className="dna-seed-gallery">
            <img className="dna-seed-main-image" src={image} alt={p.name} />
            {p.images.length > 1 && (
              <div className="dna-seed-thumbnails">
                {p.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setImage(src)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={image === src}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
            <section id="seed-description" className="dna-seed-description">
              <h2>Product Details</h2>
              <p>{p.description}</p>
            </section>
          </div>
          <div className="dna-seed-summary">
            <h1>{p.name}</h1>
            <dl>
              {[
                ["Genetics", p.genetics],
                ["Genotype", p.strainType],
                ["Flowering Time", p.floweringTime],
                ["Yield", p.yield],
                ["Type", p.category],
              ]
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
            <p className="dna-seed-short">
              {p.shortDescription} <a href="#seed-description">Read More</a>
            </p>
            <fieldset className="dna-seed-packs">
              <legend>Pack sizes</legend>
              <div>
                {p.variants.map((v) => (
                  <label
                    key={v.id}
                    className={selected.id === v.id ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="pack-size"
                      value={v.size}
                      checked={selected.id === v.id}
                      onChange={() => setSize(v.size)}
                    />
                    <span className="dna-pack-label">{v.size}x</span>
                    <img src={p.images[0]} alt="" />
                    <strong>{money(v.salePrice ?? v.price)}</strong>
                    <span className="dna-pack-discount">
                      {v.salePrice !== null && (
                        <>
                          <del>{money(v.price)}</del>
                          <span>
                            {Math.round((1 - v.salePrice / v.price) * 100)}%
                          </span>
                        </>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <p className="dna-selected-pack" aria-live="polite">
              Selected: {selected.size} seeds ·{" "}
              {money(selected.salePrice ?? selected.price)}
            </p>
            <button
              className="dna-seed-purchase"
              onClick={() => { add(p, 1, selected.id); setAdded(selected.id); }}
              aria-describedby="seed-stock-note"
            >
              <span>
                Add to Cart Now <span aria-hidden="true">→</span>
              </span>
              <strong>{money(selected.salePrice ?? selected.price)}</strong>
            </button>
            <p id="seed-stock-note" className="dna-seed-stock-note">
              {selected.stock === 0
                ? "This pack has no local inventory yet."
                : "This pack is available for simulated checkout."}
            </p>
            {added === selected.id && <p role="status">Added {selected.size}-seed pack to cart. <Link to="/cart">View cart →</Link></p>}
            <div className="dna-seed-service-strip">
              <span>Privacy Guarantee</span>
              <span>Germination Guarantee</span>
              <span>Expert Support</span>
            </div>
          </div>
        </div>
        <section className="dna-seed-tabs">
          <div role="tablist" aria-label="Product information">
            {["Description", "Additional information", "Reviews"].map(
              (title) => (
                <button
                  key={title}
                  role="tab"
                  id={`seed-tab-${title.replaceAll(" ", "-")}`}
                  aria-selected={tab === title}
                  aria-controls="seed-tab-panel"
                  onClick={() => setTab(title)}
                >
                  {title}
                </button>
              ),
            )}
          </div>
          <div
            id="seed-tab-panel"
            role="tabpanel"
            aria-labelledby={`seed-tab-${tab.replaceAll(" ", "-")}`}
          >
            {tab === "Description" ? (
              <p>{p.description}</p>
            ) : tab === "Additional information" ? (
              <table>
                <tbody>
                  <tr>
                    <th scope="row">Size</th>
                    <td>{p.variants.map((v) => v.size).join(", ")}</td>
                  </tr>
                  <tr>
                    <th scope="row">SKU</th>
                    <td>{p.sku}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No product reviews have been added yet.</p>
            )}
          </div>
        </section>
        <section className="dna-seed-related">
          <h2>Related products</h2>
          <div className="dna-seed-grid">
            {related.slice(0, 4).map((product) => (
              <SeedCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
