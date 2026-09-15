import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    api(`/reviews?productId=${encodeURIComponent(productId)}`)
      .then((rows) => active && setReviews(rows))
      .catch(() => active && setReviews([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [productId]);
  if (loading) return <p>Loading reviews…</p>;
  if (!reviews.length) return <p>No product reviews have been added yet.</p>;
  return (
    <div className="dna-product-reviews">
      {reviews.map((review) => (
        <article key={review.id}>
          <header>
            <strong>{review.author}</strong>
            <span aria-label={`${review.rating} out of 5 stars`}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
            <time dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString("en-GB")}
            </time>
          </header>
          <p>{review.text}</p>
        </article>
      ))}
    </div>
  );
}
