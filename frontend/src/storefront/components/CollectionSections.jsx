import React from "react";
import { Link } from "react-router-dom";
import "./CollectionSections.css";

const assets = "/assets/images/collections/";
const categories = [
  ["Autoflower Seeds", "canabis3@2x.webp", "/shop?category=Autoflower%20Seeds"],
  ["Feminized Seeds", "canabis1@2x.webp", "/shop?category=Feminized%20Seeds"],
  ["Regular Seeds", "canabis2.webp", "/shop?category=Regular%20Seeds"],
  ["Promos", "canabis5.webp", "/promotions"],
  ["Seed Vault Club", "canabis4@2x.webp", "/club"],
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
          history. From familiar seed categories to the Seed Vault Club,
          discover the different parts of the brand and find your way around its
          catalogue.
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

export function WholesaleSection() {
  return (
    <section
      className="dna-wholesale dna-collection-section"
      aria-labelledby="dna-wholesale-title"
    >
      <div className="dna-collection-container dna-wholesale-grid">
        <img
          className="dna-wholesale-image"
          src={assets + "best_wholesale_online.webp"}
          alt="DNA Genetics wholesale collection"
          loading="lazy"
        />
        <div className="dna-wholesale-copy">
          <h2 id="dna-wholesale-title">
            Best Marijuana Wholesale Seeds Online
          </h2>
          <p>
            Discover another part of the DNA Genetics story: its wholesale
            program and the relationships behind the brand.
          </p>
          <p>
            The <Link to="/wholesale">wholesale information page</Link>{" "}
            introduces this part of the collection. It provides a place to
            explore the program as we build out the educational storefront.
          </p>
          <p>
            DNA Genetics brings a long history of selection and development to
            its range, with established varieties alongside newer additions.
          </p>
          <p>
            Browse the brand’s catalogue to learn more about the names and
            collections featured throughout the site.
          </p>
          <p>For further information, visit our contact page.</p>
          <Link className="dna-collection-button" to="/contact">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
