import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CheckoutFields({ user, busy }) {
  const paymentOptions = [
    [
      "zelle",
      "Zelle",
      "A confirmation email with instructions on how to complete payment via zelle will be issued to you. Please click Complete Order and check your email inbox in the next 1-4 minutes after doing so. Check your spam or junk filter if you do not see the email within the 1-4 minute arrival period.",
    ],
    [
      "chime",
      "Chime",
      "A confirmation email with instructions on how to complete payment via chime will be issued to you. Please click Complete Order and check your email inbox in the next 1-4 minutes after doing so. Check your spam or junk filter if you do not see the email within the 1-4 minute arrival period.",
    ],
    [
      "bitcoin",
      "Bitcoin",
      "For Bitcoin payments, copy the wallet address, complete your payment, and send a screenshot via your order confirmation. bc1q3a4upeum5gh30qyljnefgf3guyyjl6sn5jsd63",
    ],
    [
      "apple-pay-gift-card",
      "Apple Pay Gift Card",
      "A confirmation email with instructions on how to complete payment via apple Pay will be issued to you. Please click Complete Order and check your email inbox in the next 1-4 minutes after doing so. Check your spam or junk filter if you do not see the email within the 1-4 minute arrival period.",
    ],
  ];
  const [paymentMethod, setPaymentMethod] = useState("zelle");
  const field = (name, label, autoComplete, type = "text", required = true) => (
    <label className="dna-checkout-field" key={name}>
      {label}
      {required && " *"}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={name === "email" ? 254 : 150}
        defaultValue={name === "email" ? user?.email || "" : undefined}
      />
    </label>
  );
  return (
    <fieldset className="dna-checkout-fields" disabled={busy}>
      <section className="dna-checkout-step">
        <h2>Contact information</h2>
        {field("email", "Email address", "email", "email")}
      </section>
      <section className="dna-checkout-step">
        <h2>Postal address</h2>
        <div className="dna-checkout-field-grid">
          <label className="dna-checkout-field dna-checkout-wide">
            Country / Region *
            <select name="country" defaultValue="">
              <option value="" disabled>
                Select a country / region
              </option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          {field("firstName", "First name", "given-name")}
          {field("lastName", "Last name", "family-name")}
          <div className="dna-checkout-wide">
            {field("address", "Street address", "address-line1")}
          </div>
          <div className="dna-checkout-wide">
            {field(
              "address2",
              "Apartment, suite, etc. (optional)",
              "address-line2",
              "text",
              false,
            )}
          </div>
          {field("city", "City / Town", "address-level2")}
          {field(
            "region",
            "State / County / Province",
            "address-level1",
            "text",
            false,
          )}
          {field("postalCode", "Postcode / ZIP code", "postal-code")}
          {field("phone", "Phone", "tel", "tel")}
        </div>
      </section>
      <section className="dna-checkout-step">
        <h2>Shipping options</h2>
        <p className="dna-checkout-option">
          Standard shipping <strong>5% · Free on orders £120 and over</strong>
        </p>
      </section>
      <section className="dna-checkout-step">
        <h2>Payment options</h2>
        <div
          className="dna-payment-options"
          role="radiogroup"
          aria-label="Demonstration payment method"
        >
          {paymentOptions.map(([value, label, description]) => (
            <div
              className={`dna-payment-method ${paymentMethod === value ? "is-selected" : ""}`}
              key={value}
            >
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                <span>{label}</span>
              </label>
              {paymentMethod === value && (
                <div className="dna-payment-description">
                  <p>{description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section className="dna-checkout-step">
        <label className="dna-checkout-field" htmlFor="order-note">
          Add a note to your order
        </label>
        <textarea
          id="order-note"
          name="orderNote"
          rows="4"
          maxLength="1000"
          placeholder="Notes about your simulated order (optional)"
        />
      </section>
      <label className="check dna-checkout-agreement">
        <input type="checkbox" name="termsAccepted" />
        <span>
          By proceeding with your purchase you agree to our{" "}
          <Link to="/terms-conditions" target="_blank">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" target="_blank">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
    </fieldset>
  );
}
