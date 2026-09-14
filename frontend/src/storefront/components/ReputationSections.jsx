import React, { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import { Link } from "react-router-dom";
import "./ReputationSections.css";

export function CrowdSection() {
  const [reviews, setReviews] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const track = useRef(null);
  useEffect(() => {
    let active = true;
    api("/reviews")
      .then((rows) => {
        if (active) setReviews(rows);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  function move(direction) {
    track.current.scrollBy({
      left: direction * track.current.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section className="dna-crowd" aria-labelledby="dna-crowd-title">
      <div className="dna-reputation-container">
        <h2 id="dna-crowd-title">The Crowd Has Spoken</h2>
        {loading ? (
          <p role="status">Loading reviews…</p>
        ) : error ? (
          <p role="alert">Reviews are unavailable right now.</p>
        ) : !reviews.length ? (
          <p className="dna-crowd-empty">No published reviews yet.</p>
        ) : (
          <>
            <div className="dna-crowd-track" ref={track}>
              {reviews.map((r) => (
                <article className="dna-review" key={r.id}>
                  <header>
                    <span className="dna-review-avatar" aria-hidden="true">
                      {r.author.slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <h3>{r.author}</h3>
                      <span
                        className="dna-review-stars"
                        aria-label={`${r.rating} out of 5 stars`}
                      >
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </span>
                    </div>
                    <time dateTime={r.createdAt}>
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        timeZone: "UTC",
                      })}
                    </time>
                  </header>
                  <p>{r.text}</p>
                </article>
              ))}
            </div>
            {reviews.length > 1 && (
              <div className="dna-reputation-controls">
                <button aria-label="Previous reviews" onClick={() => move(-1)}>
                  ‹
                </button>
                <button aria-label="Next reviews" onClick={() => move(1)}>
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

const logos = [
  ["Leafly", "leafly_logo.png"],
  ["The Cannigma", "the_cannigma_logo.png"],
  ["High Times", "high_times_logo.png"],
  ["Herb", "herb_logo.png"],
  ["Washington City Paper", "washington_city_paper_logo.png"],
  ["East Bay Times", "easy_bay_times_logo.png"],
];
export function RecommendedSection() {
  return (
    <section
      className="dna-recommended"
      aria-labelledby="dna-recommended-title"
    >
      <div className="dna-reputation-container">
        <h2 id="dna-recommended-title">As Recommended By</h2>
        <div className="dna-recommended-logos">
          {logos.map(([name, file]) => (
            <img
              key={file}
              src={`/assets/images/reputation/${file}`}
              alt={name}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  [
    "Which payment options do you accept?",
    "This project uses simulated checkout only. It does not collect real payments.",
  ],
  [
    "How can I contact you?",
    <>
      The <Link to="/contact">contact page</Link> is available through the site
      navigation. Live messaging will depend on the backend setup.
    </>,
  ],
  [
    "What is your return policy?",
    "There are no physical purchases or returns in this educational project. Any order records are simulated.",
  ],
  [
    "Can I change my order?",
    "Order management is part of the local dashboard. Changes apply only to simulated order records.",
  ],
  [
    "Where do you ship?",
    "This local project does not dispatch products or arrange delivery.",
  ],
  [
    "When will my order be processed?",
    "Simulated orders can be reviewed through the dashboard when the backend is connected. There is no physical fulfilment.",
  ],
  [
    "Can I track an order?",
    <>
      Visit <Link to="/account">your account</Link> to view the order
      information available in the connected project.
    </>,
  ],
];
export function HomeFaqSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="dna-home-faq" aria-labelledby="dna-home-faq-title">
      <div className="dna-reputation-container">
        <h2 id="dna-home-faq-title">Frequently Asked Questions</h2>
        <div className="dna-home-faq-list">
          {faqs.map(([question, answer], i) => (
            <div className="dna-home-faq-item" key={question}>
              <h3>
                <button
                  id={`faq-question-${i}`}
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  {question}
                  <span aria-hidden="true">{open === i ? "−" : "+"}</span>
                </button>
              </h3>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={open !== i}
              >
                <p>{answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
