import React from "react";
import { Link } from "react-router-dom";
import flowers from "../../data/flowerInformation.json";
import "./SeedCatalogue.css";
import "./FlowerInformation.css";

export default function FlowerInformation() {
  return (
    <div className="dna-seed-page dna-flower-information">
      <section className="dna-seed-banner">
        <h1>THCa Flower</h1>
        <p>
          Learn about THCA and explore the reference flower gallery.
          <br />
          An informational page for this educational project.
        </p>
      </section>
      <div className="dna-seed-container">
        <nav className="dna-seed-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">THCa Flower</span>
        </nav>
        <section aria-label="Flower reference gallery">
          <p className="dna-flower-count">
            {flowers.length} varieties in this gallery
          </p>
          <div className="dna-flower-grid">
            {flowers.map((flower) => (
              <figure key={flower.image}>
                <img
                  src={flower.image}
                  alt={flower.name}
                  loading="lazy"
                  width="300"
                  height="300"
                />
                <figcaption>{flower.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
        <article className="dna-seed-information">
          <h2>What Is THCA Flower?</h2>
          <p>
            THCA stands for tetrahydrocannabinolic acid, a cannabinoid found in
            cannabis. It is chemically distinct from THC. The term “THCA flower”
            describes cannabis flower marketed for its THCA content.
          </p>
          <h2>THCA and THC</h2>
          <p>
            THCA can convert to THC through decarboxylation, a chemical change
            associated with heat. A THCA label does not mean a product cannot
            produce intoxicating effects.
          </p>
          <h2>Understanding the gallery</h2>
          <p>
            The images and variety names above document the reference website.
            Appearance and variety names alone cannot establish a sample’s
            cannabinoid content, purity, or effects.
          </p>
          <h2>Frequently asked questions</h2>
          <details>
            <summary>What does THCA stand for?</summary>
            <p>THCA is short for tetrahydrocannabinolic acid.</p>
          </details>
          <details>
            <summary>Is THCA the same substance as THC?</summary>
            <p>
              No. They have different chemical structures. THCA can convert into
              THC through decarboxylation.
            </p>
          </details>
          <details>
            <summary>Can a photograph show cannabinoid content?</summary>
            <p>
              No. A photograph cannot verify cannabinoid percentages or the
              composition of a particular sample.
            </p>
          </details>
        </article>
      </div>
    </div>
  );
}
