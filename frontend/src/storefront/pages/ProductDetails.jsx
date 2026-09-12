import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, money } from "../../services/api";
import { useApp } from "../../hooks/context";
import { ProductCollection } from "../components/HomeSections";
import SeedProduct from "./SeedProduct";
export default function ProductDetails() {
  const { slug } = useParams(),
    { add } = useApp(),
    [p, setP] = useState(null),
    [related, setRelated] = useState([]),
    [qty, setQty] = useState(1),
    [image, setImage] = useState(""),
    [error, setError] = useState(""),
    [added, setAdded] = useState(false);
  useEffect(() => {
    setP(null);
    setError("");
    setAdded(false);
    setQty(1);
    let active = true;
    Promise.all([api(`/products/${slug}`), api("/products")])
      .then(([p, all]) => {
        if (active) {
          setP(p);
          setImage(p.images[0]);
          setRelated(
            all.filter((x) => x.id !== p.id && x.category === p.category),
          );
        }
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [slug]);
  if (error) return <p className="section error">{error}</p>;
  if (!p) return <p className="section">Loading product…</p>;
  if (p.variants?.length)
    return <SeedProduct key={p.id} product={p} related={related} />;
  return (
    <>
      <section className="section">
        <p>
          <Link to="/shop">Catalogue</Link> / {p.name}
        </p>
        <div className="product-detail">
          <div>
            <div className="gallery">
              <img
                src={image || "/assets/images/products/seed-pack.svg"}
                alt={p.name}
              />
            </div>
            <div className="thumbnails">
              {p.images.map((src) => (
                <button
                  key={src}
                  onClick={() => setImage(src)}
                  aria-label="View gallery image"
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">{p.category}</p>
            <h1>{p.name}</h1>
            <p>{p.shortDescription}</p>
            <p className="price">{money(p.salePrice ?? p.price)}</p>
            <p className="muted">Sample price · {p.stock} in inventory</p>
            <form
              className="buy-row"
              onSubmit={(e) => {
                e.preventDefault();
                add(p, qty);
                setAdded(true);
              }}
            >
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  max={Math.min(99, p.stock)}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  required
                />
              </label>
              <button className="button gold" disabled={!p.stock}>
                {p.stock ? "Add to bag" : "Out of stock"}
              </button>
            </form>
            {added && (
              <p role="status">
                Added to bag. <Link to="/cart">View bag →</Link>
              </p>
            )}
            <p className="notice">
              Educational project only. No purchase or delivery is possible.
            </p>
            <h3>Product details</h3>
            <p>{p.description}</p>
            <dl>
              {[
                ["SKU", p.sku],
                ["Category", p.category],
                ["Type", p.strainType],
                ["Genetics", p.genetics],
              ].map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt>{k}</dt>
                  <dd>{v || "—"}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <ProductCollection title="More from the collection" products={related} />
    </>
  );
}
