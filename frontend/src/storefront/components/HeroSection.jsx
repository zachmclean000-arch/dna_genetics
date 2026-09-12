import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

const slides = [
  {
    image: "/assets/images/homepage/banner-1.jpg",
    label: "DNA Genetics — ready for the new season",
  },
  {
    image: "/assets/images/homepage/banner-2.jpg",
    label: "DNA Genetics — 3Peat promotion",
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hidden, setHidden] = useState(document.hidden);
  const touch = useRef(null);
  const move = (delta) =>
    setActive((index) => (index + delta + slides.length) % slides.length);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => setReducedMotion(media.matches);
    const visibilityChanged = () => setHidden(document.hidden);
    media.addEventListener("change", motionChanged);
    document.addEventListener("visibilitychange", visibilityChanged);
    return () => {
      media.removeEventListener("change", motionChanged);
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion || hidden) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, hidden, active]);

  return (
    <section
      className="dna-hero-carousel"
      aria-label="DNA Genetics highlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onTouchStart={(event) => {
        touch.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        };
      }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy))
          move(dx > 0 ? -1 : 1);
        touch.current = null;
      }}
    >
      <h1 className="dna-visually-hidden">DNA Genetics</h1>
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`dna-hero-slide ${active === index ? "is-active" : ""}`}
          aria-hidden={active !== index}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
        >
          <Link
            to="/shop"
            aria-label={`${slide.label} — view catalogue`}
            tabIndex={active === index ? 0 : -1}
          >
            <img
              src={slide.image}
              alt={slide.label}
              width="1280"
              height="285"
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
          </Link>
        </div>
      ))}
      <button
        className="dna-hero-arrow dna-hero-prev"
        aria-label="Previous banner"
        onClick={() => move(-1)}
      >
        <span aria-hidden="true">&#xf053;</span>
      </button>
      <button
        className="dna-hero-arrow dna-hero-next"
        aria-label="Next banner"
        onClick={() => move(1)}
      >
        <span aria-hidden="true">&#xf054;</span>
      </button>
      {!reducedMotion && (
        <button
          className="dna-hero-pause"
          onClick={() => setPaused(!paused)}
          aria-label={
            paused ? "Play banner slideshow" : "Pause banner slideshow"
          }
        >
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </section>
  );
}
