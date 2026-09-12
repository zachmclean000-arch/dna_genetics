import React from "react";
import { Link } from "react-router-dom";
import promotions from "../../data/promotions.json";
import "./Promotions.css";

function PromotionCard({ offer }) {
  return (
    <article
      className={`dna-promo-card${offer.active ? "" : " is-closed"}`}
      aria-label={offer.title}
    >
      <figure>
        <img
          src={offer.image}
          alt={`${offer.title} promotion artwork`}
          loading={offer.active ? "eager" : "lazy"}
        />
      </figure>
      <div className="dna-promo-status">
        Promotion {offer.active ? "Active" : "Closed"}
      </div>
      <p>
        <strong>{offer.title}:</strong> {offer.description}
      </p>
    </article>
  );
}

export default function Promotions() {
  return (
    <div className="dna-promotions-page">
      <section
        className="dna-promotions-banner"
        aria-labelledby="dna-promotions-title"
      >
        <div>
          <h1 id="dna-promotions-title">Store Promotions</h1>
          <p>
            Browse the current seed offers and previous promotions from the DNA
            Genetics store.
            <br />
            Offers apply to this website only. Complimentary items depend on
            availability.
          </p>
          <p>
            <strong>
              One promotion per order. Offers cannot be combined with other
              discounts, and eligibility requirements apply.
            </strong>
          </p>
        </div>
      </section>
      <div className="dna-promotions-container">
        <nav className="dna-promotions-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Promos</span>
        </nav>
        <section
          className="dna-promotions-grid dna-promotions-active"
          aria-label="Active promotions"
        >
          {promotions
            .filter((offer) => offer.active)
            .map((offer) => (
              <PromotionCard key={offer.id} offer={offer} />
            ))}
        </section>
        <section
          className="dna-promotions-grid dna-promotions-closed"
          aria-label="Closed promotions"
        >
          {promotions
            .filter((offer) => !offer.active)
            .map((offer) => (
              <PromotionCard key={offer.id} offer={offer} />
            ))}
        </section>
      </div>
    </div>
  );
}
