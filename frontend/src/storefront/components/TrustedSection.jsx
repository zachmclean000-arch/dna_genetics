import React from "react";
import { Link } from "react-router-dom";
import "./TrustedSection.css";

const root = "/assets/images/trusted/";
const seeds = [
  ["Purple Chocolope", "DNA_Genetics_Purple_Kosher-2-768x768-1.webp"],
  ["Chocolope Fem", "DNA-Genetics-Chocolope-1-min-768x768-min-sm.webp"],
  ["Strawberry Banana", "DNA-Genetics-Strawberry-Banana-S1.webp"],
  ["Bruised Bananas", "Bruised_Bananas_DNA_Genetics-1-768x768-1.webp"],
];
const shop = "/shop/feminized-seeds";

export default function TrustedSection() {
  return (
    <section className="dna-trusted" aria-labelledby="dna-trusted-title">
      <div className="dna-trusted-container">
        <div className="dna-trusted-seeds">
          {seeds.map(([name, image]) => (
            <Link key={name} to={shop}>
              <img
                src={root + image}
                alt={name}
                width="768"
                height="768"
                loading="lazy"
              />
              <span>{name}</span>
            </Link>
          ))}
          <Link className="dna-trusted-button" to={shop}>
            Shop Feminized Seeds
          </Link>
        </div>
        <div className="dna-trusted-content">
          <div className="dna-trusted-copy">
            <h2 id="dna-trusted-title">
              <img
                src="/assets/images/flower/crown.png"
                alt=""
                width="30"
                height="21"
              />
              Proven and Trusted Premium Genetics
            </h2>
            <p>
              DNA Genetics brings more than two decades of breeding experience
              to its collection. Its work has helped establish the brand among
              internationally recognized names in cannabis genetics.
            </p>
            <p>
              A dedication to growers and hash-makers has shaped the company
              from the beginning. That same focus continues to guide its
              approach to selecting and developing varieties.
            </p>
            <p>
              Careful selection and testing underpin the collection, with an
              emphasis on consistent quality and customer satisfaction. The
              breeding program reflects a long-standing commitment to the people
              who choose DNA Genetics.
            </p>
            <Link
              className="dna-trusted-button dna-trusted-desktop-button"
              to={shop}
            >
              Shop Feminized Seeds Now <span aria-hidden="true">→</span>
            </Link>
          </div>
          <img
            className="dna-trusted-anniversary"
            src={root + "DNA_Genetics_20YearIdent-1-1.webp"}
            alt="DNA Genetics 20th anniversary, 2004–2024. Grow Your Own."
            loading="lazy"
          />
        </div>
      </div>
      <img
        className="dna-trusted-tear"
        src={root + "tear-bg-desk.webp"}
        alt=""
      />
    </section>
  );
}
