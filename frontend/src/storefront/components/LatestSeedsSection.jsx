import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import seeds from "../../data/latestSeeds.json";
import "./LatestSeedsSection.css";

export default function LatestSeedsSection() {
  const track = useRef(null);
  const [position, setPosition] = useState(0);
  function move(direction) {
    const el = track.current;
    const step = el.firstElementChild.getBoundingClientRect().width;
    const end = el.scrollWidth - el.clientWidth;
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
    <section className="dna-latest" aria-labelledby="dna-latest-title">
      <div className="dna-latest-container">
        <h2 id="dna-latest-title">
          <img
            src="/assets/images/flower/crown.png"
            alt=""
            width="50"
            height="35"
          />
          Latest DNA Genetics Cannabis Seeds
        </h2>
        <p className="dna-latest-description">
          Explore new additions to the DNA Genetics collection, from mystery
          packs to recently introduced varieties. Browse the selection and
          discover what’s new in the USA catalogue.
        </p>
        <div
          className="dna-latest-carousel"
          role="region"
          aria-label="Latest seed collection"
          aria-roledescription="carousel"
        >
          <div
            className="dna-latest-track"
            ref={track}
            tabIndex="0"
            aria-label="Scroll through latest seeds"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                move(event.key === "ArrowRight" ? 1 : -1);
              }
            }}
            onScroll={() =>
              setPosition(
                Math.round(
                  track.current.scrollLeft /
                    track.current.firstElementChild.getBoundingClientRect()
                      .width,
                ),
              )
            }
          >
            {seeds.map((seed) => (
              <article className="dna-latest-card" key={seed.image}>
                <Link to="/shop?collection=newArrival">
                  <span className="dna-latest-photo">
                    <img
                      src={seed.image}
                      alt={seed.name}
                      width="768"
                      height="768"
                      loading="lazy"
                    />
                  </span>
                  <h3>{seed.name}</h3>
                </Link>
              </article>
            ))}
          </div>
          <button
            className="dna-latest-arrow dna-latest-prev"
            aria-label="Previous seeds"
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <button
            className="dna-latest-arrow dna-latest-next"
            aria-label="Next seeds"
            onClick={() => move(1)}
          >
            ›
          </button>
          <span className="dna-latest-status" aria-live="polite">
            Collection starting at item {position + 1} of {seeds.length}
          </span>
        </div>
      </div>
    </section>
  );
}
