import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeMediaSections.css";

const root = "/assets/images/home-media/";
const promotions = [
  [
    "Kush Pack",
    "asset-0.jpeg",
    "Explore the reference artwork for the DNA Genetics Kush Pack collection.",
  ],
  [
    "Free Seed Promo",
    "asset-1.jpg",
    "Discover the featured promotion artwork from the DNA Genetics collection.",
  ],
  [
    "DNA Points",
    "asset-2.jpg",
    "A look at the brand’s loyalty program and its distinctive DNA Points design.",
  ],
  [
    "Free Shipping",
    "asset-3.jpg",
    "The reference shipping promotion, presented here as part of the storefront design.",
  ],
];
const guides = [
  ["Bitesize: Why Feminized", 4],
  ["Bitesize: Plant Roles", 6],
  ["Cleaning Your Seeds", 7],
  ["Bitesize: Pollination", 8],
];
const media = [
  ["Sean and Shay", 9],
  ["Jed and Jennifer", 10],
  ["Adam and Erin", 11],
  ["Ophelia", 12],
];

export function PromotionsSection() {
  return (
    <section
      className="dna-home-promotions dna-home-media-section"
      aria-labelledby="dna-promotions-title"
    >
      <h2 id="dna-promotions-title">Promotions</h2>
      <div className="dna-home-promotions-grid">
        {promotions.map(([name, file, description]) => (
          <article key={name}>
            <Link to="/promotions" aria-label={`View ${name}`}>
              <img
                src={root + file}
                alt={`${name} reference promotional artwork`}
                loading="lazy"
              />
            </Link>
            <p>
              <strong>{name}:</strong> {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function MediaGallery({ id, title, subtitle, items }) {
  const dialog = useRef(null);
  const track = useRef(null);
  const [preview, setPreview] = useState(null);
  function move(direction) {
    track.current.scrollBy({
      left: direction * track.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section
      className="dna-home-gallery dna-home-media-section"
      aria-labelledby={id}
    >
      <div className="dna-home-media-container">
        <h2 id={id}>
          <img
            className="dna-home-media-crown"
            src="/assets/images/flower/crown.png"
            alt=""
            width="50"
            height="35"
          />
          {title}
        </h2>
        <p className="dna-home-media-subtitle">{subtitle}</p>
        <div className="dna-home-media-track" ref={track}>
          {items.map(([name, index]) => (
            <article key={name}>
              <button
                className="dna-home-media-preview"
                aria-label={`Preview ${name}`}
                onClick={() => {
                  setPreview({ name, index });
                  dialog.current.showModal();
                }}
              >
                <img
                  className="dna-home-media-thumbnail"
                  src={`${root}asset-${index}.jpg`}
                  alt={name}
                  loading="lazy"
                />
                <img
                  className="dna-home-media-play"
                  src={root + "asset-5.webp"}
                  alt=""
                />
              </button>
              <h3>{name}</h3>
            </article>
          ))}
        </div>
        <div className="dna-home-media-controls">
          <button
            aria-label={`Previous ${title} thumbnails`}
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <button
            aria-label={`Next ${title} thumbnails`}
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
      </div>
      <dialog
        className="dna-home-media-dialog"
        ref={dialog}
        aria-label="Media thumbnail preview"
        onClose={() => setPreview(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <button
          className="dna-home-media-close"
          autoFocus
          aria-label="Close preview"
          onClick={() => dialog.current.close()}
        >
          ×
        </button>
        {preview && (
          <>
            <img src={`${root}asset-${preview.index}.jpg`} alt={preview.name} />
            <h3>{preview.name}</h3>
            <p>Thumbnail preview. Video playback is not connected.</p>
          </>
        )}
      </dialog>
    </section>
  );
}

export function GuideGallerySection() {
  return (
    <MediaGallery
      id="dna-guide-gallery-title"
      title="How to Grow Cannabis"
      subtitle="Video gallery by Don and Aaron"
      items={guides}
    />
  );
}
export function DnaMediaSection() {
  return (
    <MediaGallery
      id="dna-media-gallery-title"
      title="DNA Media"
      subtitle="DNA Genetics Featured on Pimp My Grow"
      items={media}
    />
  );
}
export function SkywalkerSection() {
  return (
    <section className="dna-home-skywalker" aria-label="Skywalker Kush feature">
      <picture>
        <source media="(max-width: 600px)" srcSet={root + "asset-14.webp"} />
        <img
          src={root + "asset-13.webp"}
          alt="Skywalker Kush reference banner"
          loading="lazy"
        />
      </picture>
      <Link to="/shop?q=Skywalker%20Kush">Skywalker Kush</Link>
    </section>
  );
}
