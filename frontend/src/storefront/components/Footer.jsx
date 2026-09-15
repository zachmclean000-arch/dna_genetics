import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usefulLinks, shopLinks, articleLinks } from "../../data/navigation";
import legal from "../../data/footerLegal.json";
import Icon from "./Icon";
import { api } from "../../services/api";
function LinkList({ items }) {
  return (
    <ul>
      {items.map(([label, to]) => (
        <li key={label}>
          <Link to={to}>{label}</Link>
        </li>
      ))}
    </ul>
  );
}
export default function Footer() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="dna-footer-region">
      <section
        className="dna-newsletter"
        aria-labelledby="dna-newsletter-title"
      >
        <div className="dna-container">
          <h2 id="dna-newsletter-title">GET 10% OFF YOUR FIRST ORDER!</h2>
          <p>
            <strong>Register your Email</strong> to join our{" "}
            <strong>Email Mailing List</strong> and receive a{" "}
            <strong>10% off Voucher</strong> for your next order. (One voucher
            per customer.)
          </p>
          <p>
            <strong>Don’t worry, we hate spam too</strong> — our emails cover
            new items, <strong>Special Offers</strong> and{" "}
            <strong>Launch Drops</strong>. You can unsubscribe at any time.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                const result = await api("/newsletter", {
                  method: "POST",
                  body: { email: new FormData(e.currentTarget).get("email") },
                });
                setMessage(result.message);
              } catch (error) {
                setMessage(error.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <input
              name="name"
              autoComplete="given-name"
              aria-label="Newsletter name"
              placeholder="Name"
            />
            <input
              name="email"
              type="email"
              autoComplete="email"
              aria-label="Newsletter email"
              placeholder="Email"
              required
            />
            <button disabled={busy}>
              {busy ? "Please wait…" : "Subscribe"}
            </button>
          </form>
          {message && (
            <p className="dna-subscription-message" role="status">
              {message}
            </p>
          )}
          <img
            className="dna-forest"
            src="/assets/images/footer/forest.webp"
            alt=""
            width="1639"
            height="344"
          />
        </div>
      </section>
      <footer className="dna-footer">
        <div className="dna-container">
          <div className="dna-footer-grid">
            <div className="dna-footer-legal">
              <Link
                className="dna-footer-brand"
                to="/"
                aria-label="DNA Genetics home"
              >
                <img
                  src="/assets/images/logo/footer-logo.webp"
                  width="128"
                  height="99"
                  alt="DNA Genetics"
                />
              </Link>
              {legal.map((paragraph, index) => (
                <p key={index}>
                  {paragraph
                    .split(
                      /(DNAGENETICS\.COM|https:\/\/www\.p65warnings\.ca\.gov\/\S+)/gi,
                    )
                    .map((text, i) =>
                      /^(DNAGENETICS\.COM|https:)/i.test(text) ? (
                        <Link
                          key={i}
                          to={text.startsWith("http") ? "/privacy" : "/"}
                        >
                          {text}
                        </Link>
                      ) : (
                        <React.Fragment key={i}>
                          {text.includes(":") && i === 0 ? (
                            <>
                              <strong>
                                {text.slice(0, text.indexOf(":") + 1)}
                              </strong>
                              {text.slice(text.indexOf(":") + 1)}
                            </>
                          ) : (
                            text
                          )}
                        </React.Fragment>
                      ),
                    )}
                </p>
              ))}
            </div>
            <div className="dna-footer-useful">
              <h3>USEFUL LINKS</h3>
              <LinkList items={usefulLinks} />
            </div>
            <div className="dna-footer-shop">
              <h3>SHOP PAGES</h3>
              <LinkList items={shopLinks} />
              <h3 className="dna-footer-secondary-title">FOLLOW US</h3>
              <div className="dna-social">
                {["instagram", "youtube", "vimeo", "twitter", "reddit"].map(
                  (name) => (
                    <Link key={name} to={`/social/${name}`} aria-label={name}>
                      <Icon name={name} />
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div className="dna-footer-articles">
              <h3>CANNABIS ARTICLES</h3>
              <LinkList items={articleLinks} />
              <h3 className="dna-footer-secondary-title">PAYMENTS</h3>
              <div className="dna-payments" aria-label="Payment options">
                {["visa", "mastercard", "amex"].map((name) => (
                  <span key={name} role="img" aria-label={name}>
                    <Icon name={name} />
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="dna-copyright">
            <h3>COPYRIGHT 2026 © ALL RIGHTS RESERVED. DNA GENETICS</h3>
            <p>
              Keep out of reach of children. For adults use by 21 years and
              older
              <br />
              Built &amp; Powered by <strong>Quantm Media</strong>
            </p>
            <p className="dna-site-note">
              Unofficial catalogue interface · Not affiliated with DNA Genetics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
