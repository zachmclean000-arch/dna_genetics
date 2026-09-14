import React from "react";
import { Link } from "react-router-dom";
import "./CollectionSections.css";

const assets = "/assets/images/collections/";
const categories = [
  ["Autoflower Seeds", "canabis3@2x.webp", "/shop?category=Autoflower%20Seeds"],
  ["Feminized Seeds", "canabis1@2x.webp", "/shop?category=Feminized%20Seeds"],
  ["Regular Seeds", "canabis2.webp", "/shop?category=Regular%20Seeds"],
  ["Promos", "canabis5.webp", "/promotions"],
];

export function QualityCollectionSection() {
  return (
    <section
      className="dna-quality dna-collection-section"
      aria-labelledby="dna-quality-title"
    >
      <div className="dna-collection-container">
        <h2 id="dna-quality-title">
          <img
            className="dna-quality-crown"
            src="/assets/images/flower/crown.png"
            alt=""
            width="50"
            height="35"
          />
          DNA Genetics: Where Proven Quality Meets Premium Seeds
        </h2>
        <p className="dna-quality-intro">
          Explore a collection shaped by more than twenty years of DNA Genetics
          history. Browse familiar seed categories, discover the different parts
          of the brand and find your way around its catalogue.
        </p>
        <ul className="dna-quality-categories">
          {categories.map(([name, file, href]) => (
            <li key={name}>
              <Link to={href}>
                <span className="dna-quality-icon">
                  <img src={assets + file} alt="" loading="lazy" />
                </span>
                <h3>{name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FeaturedChocolopeSection() {
  return (
    <section
      className="dna-chocolope dna-collection-section"
      aria-labelledby="dna-chocolope-title"
    >
      <img
        className="dna-chocolope-edge"
        src={assets + "top-pattern-wht.webp"}
        alt=""
      />
      <div className="dna-collection-container dna-chocolope-grid">
        <div className="dna-chocolope-copy">
          <h2 id="dna-chocolope-title">
            <span>Featured Strain:</span> Chocolope
          </h2>
          <p>
            Meet Chocolope, a familiar name in the DNA Genetics collection. This
            feature celebrates its place in the brand’s history with distinctive
            chocolate-inspired artwork.
          </p>
          <p>
            Chocolope has received recognition over the years, including the
            High Times Strain of the Year title in 2007. It remains one of the
            varieties closely associated with DNA Genetics.
          </p>
          <p>
            Explore its place in the catalogue and discover more of the
            collection’s established names.
          </p>
          <p>
            The reference artwork brings together the Chocolope name, product
            packaging and chocolate imagery in a dedicated feature.
          </p>
          <Link className="dna-collection-button" to="/shop?q=Chocolope">
            Explore Chocolope <span aria-hidden="true">→</span>
          </Link>
        </div>
        <img
          className="dna-chocolope-product"
          src={assets + "choco-img.webp"}
          alt="Chocolope packaging with chocolate-themed artwork"
          loading="lazy"
        />
      </div>
    </section>
  );
}
