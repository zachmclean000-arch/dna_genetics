import React, { useRef } from "react";
import { Link } from "react-router-dom";
import data from "../../data/lowerHome.json";
import "./LowerHomeSections.css";

export function BestSellersSection() {
  const track = useRef(null);
  const move = (direction) =>
    track.current.scrollBy({
      left: direction * track.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  return (
    <section
      className="dna-lower dna-bestsellers"
      aria-labelledby="dna-bestsellers-title"
    >
      <div className="dna-lower-container">
        <h2 id="dna-bestsellers-title">
          Best Selling Cannabis Seeds from our Seedbank
        </h2>
        <p className="dna-lower-intro">
          Discover familiar names from the DNA Genetics collection in this
          reference catalogue.
        </p>
        <div className="dna-bestsellers-track" ref={track}>
          {data[0].products.slice(0, 8).map((product) => (
            <article key={product.name}>
              <img src={product.image} alt={product.name} loading="lazy" />
              <h3>{product.name}</h3>
              <p className="dna-bestseller-price">{product.price}</p>
              <Link
                className="dna-lower-button"
                to="/shop?collection=bestSeller"
              >
                Select Options
              </Link>
            </article>
          ))}
        </div>
        <div className="dna-lower-arrows">
          <button aria-label="Previous best sellers" onClick={() => move(-1)}>
            ‹
          </button>
          <button aria-label="Next best sellers" onClick={() => move(1)}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export function MediaPressSection() {
  return (
    <section
      className="dna-lower dna-media-press"
      style={{ backgroundImage: `url(${data[2].images[0]})` }}
      aria-labelledby="dna-media-press-title"
    >
      <div className="dna-lower-container">
        <h2 id="dna-media-press-title">Media &amp; Press</h2>
        <div className="dna-press-grid">
          {data[2].articles.map((article, i) => (
            <article key={article.name}>
              <img
                src={article.image}
                alt="Reference article artwork"
                loading="lazy"
              />
              <div>
                <h3>
                  {
                    [
                      "Exploring the DNA collection",
                      "A closer look at seed categories",
                      "Understanding the catalogue",
                      "Names from the DNA archive",
                    ][i]
                  }
                </h3>
                <p>
                  Explore the stories, categories and names represented in the
                  DNA Genetics archive.
                </p>
                <Link to="/about">
                  Read More <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DnaWaySection() {
  return (
    <section className="dna-lower dna-way" aria-labelledby="dna-way-title">
      <div className="dna-lower-container">
        <h2 id="dna-way-title">The DNA Way</h2>
        <p className="dna-lower-intro">
          Explore the qualities highlighted in the DNA Genetics brand story.
        </p>
        <div className="dna-way-grid">
          <img
            className="dna-way-photo"
            src={data[3].images[0]}
            alt="DNA Genetics brand comparison artwork"
            loading="lazy"
          />
          <table>
            <caption>Features highlighted by the reference brand</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="dna-lower-sr">Brand feature</span>
                </th>
                <th scope="col">
                  <img
                    src={data[3].images[1]}
                    alt="DNA Genetics"
                    loading="lazy"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                "Germination Guarantee",
                "Proven Stability",
                "Award-Winning Genetics",
                "Over 20 Years of Experience",
                "Exclusive Strains",
                "Global Recognition",
                "Loyalty Rewards",
                "Expert Support",
              ].map((label) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>
                    <span aria-label="Featured" role="img">
                      ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
