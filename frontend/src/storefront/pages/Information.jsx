import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation, usefulLinks, articleLinks } from "../../data/navigation";
const linkedPages = Object.fromEntries(
  [...navigation, ...usefulLinks, ...articleLinks].map(([title, path]) => [
    path.slice(1),
    [
      title,
      "This page is part of the DNA Genetics educational project. Its content will be added as we build the remaining pages.",
    ],
  ]),
);
const pages = {
  about: [
    "The D&A inside DNA.",
    "DNA Genetics was founded by Don and Aaron in Amsterdam in 2004. This school project studies the brand’s online catalogue and illustrates the software behind a storefront.",
    "This independent educational replica is not operated or endorsed by DNA Genetics. Catalogue entries and prices are sample data.",
  ],
  promotions: [
    "Deals & promotions.",
    "Explore the featured sample collection.",
    "Administrators can set sale prices and featured flags in the product editor. All discounts are simulated.",
  ],
  privacy: [
    "School project privacy.",
    "This is an independent school project, not the DNA Genetics business. If you submit the checkout form, your name, email, phone number and postal address are stored with your simulated order in this project's database. Project administrators can view them for the school campaign. Your consent and the notice version are recorded with the submission.",
    "Accounts, password hashes, locally submitted newsletter addresses and simulated orders are stored in the project database.",
    "The project uses a session cookie for login and local browser storage for the bag. Checkout contact details are not stored in browser local storage. It has no analytics, external payment provider or marketing-email service. No order is sent to the original business, no payment is taken, and nothing is shipped. Ask the school project organiser about access or removal of submitted contact details.",
  ],
  contact: [
    "Project contact",
    "This is a locally hosted classroom project.",
    "For assessment or project questions, contact your teacher or project author. This page does not submit messages to the original business.",
  ],
};
export default function Information() {
  const key = useLocation().pathname.slice(1),
    data =
      pages[key] ||
      linkedPages[key] ||
      (key.startsWith("social/")
        ? [
            `DNA Genetics on ${key.slice(7)}`,
            "Social links are represented locally in this independent educational project.",
          ]
        : null);
  return (
    <section className="section prose">
      <p className="eyebrow">DNA GENETICS / EDUCATIONAL ARCHIVE</p>
      <h1>{data?.[0] || "Page not found."}</h1>
      {data?.slice(1).map((p) => (
        <p key={p}>{p}</p>
      ))}
      <Link className="button gold" to="/shop">
        Explore the catalogue ↗
      </Link>
    </section>
  );
}
