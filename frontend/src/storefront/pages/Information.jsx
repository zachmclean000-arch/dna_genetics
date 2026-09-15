import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, usefulLinks, articleLinks } from "../../data/navigation";

const linkedPages = Object.fromEntries(
  [...navigation, ...usefulLinks, ...articleLinks].map(([title, path]) => [
    path.slice(1),
    [
      title,
      "Explore DNA Genetics products, collections, and customer information.",
    ],
  ]),
);

const pages = {
  about: [
    "The D&A inside DNA.",
    "DNA Genetics was founded by Don and Aaron in Amsterdam in 2004. Explore the brand’s history, online catalogue, and product collections.",
    "This unofficial catalogue interface is not operated or endorsed by DNA Genetics.",
  ],
  promotions: [
    "Deals & promotions.",
    "Explore featured products and current promotions.",
    "Sale prices and featured collections are updated through the product catalogue.",
  ],
  privacy: [
    "Website privacy.",
    "When you submit the checkout form, your name, email, phone number, postal address, and order information are stored in the website database and can be viewed by authorised administrators.",
    "Accounts, password hashes, newsletter addresses, and order records are stored securely by the website.",
    "The website uses a session cookie for login and local browser storage for the cart. Checkout contact details are not stored in browser local storage.",
  ],
  contact: [
    "Contact DNA Genetics",
    "Use the contact page for general enquiries.",
    "Include your order reference when contacting us about an existing order.",
  ],
};

export default function Information() {
  const key = useLocation().pathname.slice(1);
  const data =
    pages[key] ||
    linkedPages[key] ||
    (key.startsWith("social/")
      ? [
          `DNA Genetics on ${key.slice(7)}`,
          "Follow DNA Genetics news and product updates.",
        ]
      : null);
  return (
    <section className="section prose">
      <p className="eyebrow">DNA GENETICS</p>
      <h1>{data?.[0] || "Page not found."}</h1>
      {data?.slice(1).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <Link className="button gold" to="/shop">
        Explore the catalogue ↗
      </Link>
    </section>
  );
}
