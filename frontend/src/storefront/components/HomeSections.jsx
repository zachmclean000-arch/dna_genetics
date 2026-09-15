import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
export function CategorySection() {
  return (
    <section className="categories">
      {["Feminized Seeds", "Autoflower Seeds", "Regular Seeds"].map((c, i) => (
        <Link key={c} to={`/shop/${c.toLowerCase().replaceAll(" ", "-")}`}>
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
        <h2>{title}</h2>
      </div>
      <div className="product-grid">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {!products.length && <p>No related products yet.</p>}
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
          Discover the DNA Genetics story, catalogue, and unmistakable visual
          identity built around an award-winning collection.
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
      <Link className="button gold" to="/shop/best-cannabis-seeds">
        Explore classic strains ↗
      </Link>
    </section>
  );
}
export function ReviewsSection() {
  return (
    <section className="section reviews">
      <p className="eyebrow">CUSTOMER REVIEWS</p>
      <h2>Explore the DNA collection.</h2>
      <div className="review-grid">
        {[
          "Browse the complete catalogue",
          "Discover featured collections",
          "Follow your latest order",
        ].map((x, i) => (
          <article key={x}>
            <span>0{i + 1}</span>
            <h3>{x}</h3>
            <p>
              Explore products, categories, releases, and customer favourites.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
