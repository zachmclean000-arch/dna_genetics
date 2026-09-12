import React from "react";
import { Link } from "react-router-dom";
import { money } from "../../services/api";
export default function ProductCard({ product: p }) {
  return (
    <article className="product-card">
      <Link className="product-image" to={`/product/${p.slug}`}>
        <img
          src={p.images[0] || "/assets/images/products/seed-pack.svg"}
          alt={`${p.name} sample packaging`}
          loading="lazy"
        />
        {p.newArrival && <span className="badge">NEW</span>}
      </Link>
      <small>{p.category}</small>
      <h3>
        <Link to={`/product/${p.slug}`}>{p.name}</Link>
      </h3>
      <div className="product-bottom">
        <span>
          {p.salePrice !== null && <del>{money(p.price)} </del>}
          {money(p.salePrice ?? p.price)}
        </span>
        <Link to={`/product/${p.slug}`}>View options ↗</Link>
      </div>
    </article>
  );
}
