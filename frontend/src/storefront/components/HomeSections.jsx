import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
export function CategorySection() {
  return (
    <section className="categories">
      {["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].map((c, i) => (
        <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`}>
          <span>0{i + 1} / THE COLLECTION</span>
          <h2>{c}</h2>
          <b>Explore category ↗</b>
        </Link>
      ))}
    </section>
  );
}
export function ProductCollection({ title, products }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">FROM THE DNA ARCHIVE</p>
          <h2>{title}</h2>
        </div>
        <Link to="/shop">View all ↗</Link>
      </div>
      <div className="product-grid">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!products.length && <p>No products in this collection yet.</p>}
    </section>
  );
}
export function StorySection() {
  return (
    <section className="story">
      <div className="story-mark">
        D<span>&</span>A
      </div>
      <div>
        <p className="eyebrow">THE PEOPLE BEHIND THE NAME</p>
        <h2>
          The D&A
          <br />
          inside DNA.
        </h2>
        <p>
          A design study of the DNA Genetics brand, its catalogue and its visual
          identity. This independent project explores how a complete storefront
          works.
        </p>
        <Link className="button" to="/about">
          Discover the story ↗
        </Link>
      </div>
    </section>
  );
}
export function PromoSection() {
  return (
    <section className="promo">
      <p className="eyebrow">THE DNA WAY</p>
      <h2>
        Original genetics.
        <br />
        An unmistakable identity.
      </h2>
      <Link className="button gold" to="/shop?collection=bestSeller">
        Explore classic strains ↗
      </Link>
    </section>
  );
}
export function ReviewsSection() {
  return (
    <section className="section reviews">
      <p className="eyebrow">CLASSROOM REVIEW</p>
      <h2>Built to explore. Designed to learn.</h2>
      <div className="review-grid">
        {[
          "Browse a responsive catalogue",
          "Manage products in the dashboard",
          "Follow a simulated order",
        ].map((x, i) => (
          <article key={x}>
            <span>0{i + 1}</span>
            <h3>{x}</h3>
            <p>
              Interactive learning task — no real purchases, payments or
              deliveries.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
