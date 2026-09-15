import React, { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { money } from "../../services/api";
import { SeedCard } from "./FeminizedSeeds";
import "./SeedProduct.css";
import { useApp } from "../../hooks/context";
import ProductReviews from "../components/ProductReviews";
import Icon from "../components/Icon";

export default function SeedProduct({ product: p, related }) {
  const { add } = useApp();
  const hasVariants = Boolean(p.variants?.length);
  const [added, setAdded] = useState(null);
  const [params] = useSearchParams();
  const { packSize } = useParams();
  const [size, setSize] = useState(
    Number(packSize?.replace("-seeds", "")) ||
      Number(params.get("size")) ||
      p.variants?.[0]?.size ||
      0,
  );
  const [image, setImage] = useState(
    p.images[0] || "/assets/images/products/seed-pack.svg",
  );
  const [tab, setTab] = useState("Description");
  const selected = hasVariants
    ? p.variants.find((v) => v.size === size) || p.variants[0]
    : p;
  const selectedId = hasVariants ? selected.id : p.id;
  return (
    <div className="dna-seed-page">
      <div className="dna-seed-container">
        <nav className="dna-seed-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to={`/shop/${p.category.toLowerCase().replaceAll(" ", "-")}`}>
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
              {p.shortDescription} <a href="#product-information">Read More</a>
            </p>
            {hasVariants && (
              <>
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
              </>
            )}
            {!hasVariants && (
              <p className="dna-selected-pack dna-single-product-price">
                {selected.salePrice !== null && (
                  <del>{money(selected.price)}</del>
                )}
                <strong>{money(selected.salePrice ?? selected.price)}</strong>
              </p>
            )}
            <button
              className="dna-seed-purchase"
              onClick={() => {
                add(p, 1, hasVariants ? selected.id : undefined);
                setAdded(selectedId);
              }}
            >
              <span>
                Add to Cart Now <span aria-hidden="true">→</span>
              </span>
              <strong>{money(selected.salePrice ?? selected.price)}</strong>
            </button>
            {added === selectedId && (
              <p role="status">
                Added{hasVariants ? ` ${selected.size}-seed pack` : ""} to cart.{" "}
                <Link to="/cart">View cart →</Link>
              </p>
            )}
            <div className="dna-seed-service-strip">
              <span>
                <Icon name="truck" /> Free shipping on orders over $120
              </span>
              <span>
                <Icon name="privacy" /> Privacy Guarantee
              </span>
              <span>
                <Icon name="star" /> Germination Guarantee
              </span>
              <span>
                <Icon name="refresh" /> Expert Support
              </span>
            </div>
          </div>
        </div>
        <section id="product-information" className="dna-seed-tabs">
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
                  {hasVariants && (
                    <tr>
                      <th scope="row">Size</th>
                      <td>{p.variants.map((v) => v.size).join(", ")}</td>
                    </tr>
                  )}
                  <tr>
                    <th scope="row">SKU</th>
                    <td>{p.sku}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <ProductReviews productId={p.id} />
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
