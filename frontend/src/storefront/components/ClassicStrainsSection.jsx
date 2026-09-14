import React from "react";
import { Link } from "react-router-dom";
import "./ClassicStrainsSection.css";

const strains = [
  ["Blue Dream", "Blue_Dream"],
  ["Green Crack", "Green_Crack"],
  ["White Widow", "White_Widow"],
  ["GG4", "GG4"],
];

export default function ClassicStrainsSection() {
  return (
    <section className="dna-classics" aria-labelledby="dna-classics-title">
      <div className="dna-classics-container">
        <h2 id="dna-classics-title">Classic Strains the DNA Way</h2>
        <p className="dna-classics-description">
          Explore four familiar names from the DNA Genetics collection.
          <br /> Discover the varieties that have become part of its story.
        </p>
        <div className="dna-classics-grid">
          {strains.map(([name, file]) => (
            <Link
              className="dna-classics-card"
              to="/shop/best-cannabis-seeds"
              key={file}
              aria-label={`Explore ${name}`}
            >
              <img
                src={`/assets/images/classics/${file}.jpg`}
                alt={name}
                width="768"
                height="768"
                loading="lazy"
              />
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
