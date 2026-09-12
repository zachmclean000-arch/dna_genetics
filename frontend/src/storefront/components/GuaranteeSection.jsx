import React from "react";
import { Link } from "react-router-dom";
import "./GuaranteeSection.css";

const assets = "/assets/images/guarantee/";

export default function GuaranteeSection() {
  return (
    <section className="dna-guarantee" aria-labelledby="dna-guarantee-title">
      <div className="dna-guarantee-container">
        <img
          className="dna-guarantee-seal"
          src={assets + "gerate_logo-min.webp"}
          alt="Best quality guarantee"
          loading="lazy"
        />
        <div className="dna-guarantee-copy">
          <h2 id="dna-guarantee-title">Germination Guarantee</h2>
          <p>
            Quality and customer care are part of the DNA Genetics story. This
            section presents the brand’s guarantee theme as part of our
            educational storefront. Explore the collection to discover more of
            the DNA range.
          </p>
          <Link className="dna-guarantee-button" to="/shop">
            Shop Seeds Now <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="dna-guarantee-art" aria-hidden="true">
          {[1, 2, 3].map((number) => (
            <img
              key={number}
              src={`${assets}guarnted_pc${number}-min.webp`}
              alt=""
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
