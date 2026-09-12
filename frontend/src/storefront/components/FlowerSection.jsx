import React from "react";
import { Link } from "react-router-dom";
import "./FlowerSection.css";

const flowers = [
  {
    slug: "choco-mintz",
    name: "Choco Mintz",
    title: "DNA Genetics – THCa Flower - Choco Mintz",
  },
  { slug: "gaz-money", name: "GAZ Money", title: "Gaz Money THCa Flower" },
  { slug: "guavanade", name: "Guavanade", title: "Guavanade THCa Flower" },
  { slug: "honey-beez", name: "Honey Beez", title: "Honey Beez THCa Flower" },
];

export default function FlowerSection() {
  return (
    <section className="dna-flower" aria-labelledby="dna-flower-title">
      <div className="dna-flower-container">
        <h2 id="dna-flower-title">
          <img
            className="dna-flower-crown"
            src="/assets/images/flower/crown.png"
            alt=""
            width="50"
            height="35"
          />
          DNA Genetics now offers THCa Flower
        </h2>
        <p className="dna-flower-description">
          Shop our premium indoor-grown THCa flower, organically cultivated
          right here in the USA. Enjoy a high-quality, dispensary-style
          experience without compromise.
        </p>
        <div className="dna-flower-grid">
          {flowers.map((flower) => (
            <Link
              className="dna-flower-card"
              key={flower.slug}
              to={`/thca-flower#${flower.slug}`}
              aria-label={flower.title}
            >
              <span className="dna-flower-photo">
                <img
                  src={`/assets/images/flower/${flower.slug}.jpeg`}
                  alt={flower.name}
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </span>
              <h3>
                <span className="dna-flower-long-name">{flower.title}</span>
                <span className="dna-flower-short-name">{flower.name}</span>
              </h3>
            </Link>
          ))}
        </div>
        <Link className="dna-flower-shop" to="/thca-flower">
          Shop THCa Flower
        </Link>
      </div>
      <img
        className="dna-flower-divider"
        src="/assets/images/flower/divider.webp"
        alt=""
      />
    </section>
  );
}
