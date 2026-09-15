import React from "react";
const codes = {
  search: "\uf002",
  cart: "\uf07a",
  angleDown: "\uf107",
  angleRight: "\uf105",
  angleLeft: "\uf104",
  close: "\uf00d",
  instagram: "\uf16d",
  youtube: "\uf16a",
  vimeo: "\uf27d",
  twitter: "\uf099",
  reddit: "\uf281",
  visa: "\uf1f0",
  mastercard: "\uf1f1",
  amex: "\uf1f3",
  truck: "\uf0d1",
  privacy: "\uf1b0",
  star: "\uf005",
  refresh: "\uf021",
};
export default function Icon({ name }) {
  return (
    <span className="dna-icon" aria-hidden="true">
      {codes[name]}
    </span>
  );
}
