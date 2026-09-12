import React, { useRef } from "react";
import "./AwardLogoCarousel.css";

const logos = [
  [8, "Dabadoo"],
  [7, "Copa Cannabis"],
  [6, "Chalice California"],
  [5, "Blazers Cup"],
  [4, "Bio Cup"],
  [3, "Cultiva"],
  [2, "Amsterdam Unity Cup 2017"],
  [1, "Award event emblem"],
];

export default function AwardLogoCarousel() {
  const track = useRef(null);
  function move(direction) {
    const el = track.current;
    const end = el.scrollWidth - el.clientWidth;
    const step = el.firstElementChild.getBoundingClientRect().width;
    const next =
      direction > 0 && el.scrollLeft >= end - 2
        ? 0
        : direction < 0 && el.scrollLeft <= 2
          ? end
          : el.scrollLeft + direction * step;
    el.scrollTo({
      left: next,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      className="dna-award-logo-carousel"
      aria-label="Award event logos"
      aria-roledescription="carousel"
    >
      <button
        className="dna-award-logo-prev"
        aria-label="Previous award logos"
        onClick={() => move(-1)}
      >
        ←
      </button>
      <div
        className="dna-award-logo-track"
        ref={track}
        tabIndex="0"
        aria-label="Scroll award logos"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {logos.map(([number, name]) => (
          <div className="dna-award-logo-slide" key={number}>
            <img
              src={`/assets/images/about/abt_logo${number}.png`}
              alt={name}
              width="162"
              height="162"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <button
        className="dna-award-logo-next"
        aria-label="Next award logos"
        onClick={() => move(1)}
      >
        →
      </button>
    </section>
  );
}
