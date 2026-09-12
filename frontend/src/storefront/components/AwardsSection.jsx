import React from "react";
import { Link } from "react-router-dom";
import "./AwardsSection.css";

export default function AwardsSection() {
  return (
    <section className="dna-awards" aria-labelledby="dna-awards-title">
      <div className="dna-awards-panel">
        <div className="dna-awards-copy">
          <p className="dna-awards-eyebrow">
            Discover award-winning genetics and a carefully selected seed
            collection
          </p>
          <h2 id="dna-awards-title">
            Explore DNA Genetics in America, including Kosher Kush, Tangie,
            Skywalker Kush and more
          </h2>
          <p>
            The DNA Genetics USA collection brings together established
            favorites and newer varieties. Explore the range through our local
            catalogue, with dedicated collections for{" "}
            <Link to="/shop?category=Feminized%20Seeds">Feminized</Link>,{" "}
            <Link to="/shop?category=Regular%20Seeds">Regular</Link> and{" "}
            <Link to="/shop?category=Autoflower%20Seeds">Autoflower</Link>{" "}
            seeds.
          </p>
          <p className="dna-awards-note">
            This educational storefront presents the USA collection. Visit{" "}
            <Link to="/about">About DNA</Link> to learn more about the brand.
          </p>
        </div>
      </div>
      <div className="dna-awards-photo">
        <img
          src="/assets/images/awards/genetics.webp"
          alt="Two men on a balcony overlooking the falls, with the DNA Genetics logo"
          width="962"
          height="743"
          loading="lazy"
        />
      </div>
    </section>
  );
}
