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
  club: [
    "Seed Vault Club",
    "A membership-page design study.",
    "Membership registration and paid subscriptions are not offered in this project.",
  ],
  merchandise: [
    "The merchandise archive.",
    "This part of the educational catalogue has no sample merchandise yet.",
    "Administrators can create a Merchandise category and add sample products.",
  ],
  wholesale: [
    "Wholesale",
    "An informational page in the school project.",
    "No wholesale enquiries, sales or deliveries are processed.",
  ],
  promotions: [
    "Deals & promotions.",
    "Explore the featured sample collection.",
    "Administrators can set sale prices and featured flags in the product editor. All discounts are simulated.",
  ],
  privacy: [
    "DNA Genetics privacy.",
    "Accounts, password hashes, locally submitted newsletter addresses and simulated orders are stored in the project database.",
    "The project uses a session cookie for login and local browser storage for the bag. It has no analytics, external payment provider or marketing-email service. Use fictional account information.",
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
