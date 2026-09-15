import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const empty = {
  productId: "",
  author: "",
  text: "",
  rating: 5,
  published: false,
};
export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]),
    [products, setProducts] = useState([]),
    [productSearch, setProductSearch] = useState(""),
    [form, setForm] = useState(empty),
    [editing, setEditing] = useState(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const normalizedSearch = productSearch.trim().toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      product.id === form.productId ||
      !normalizedSearch ||
      [product.name, product.sku, product.category].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(normalizedSearch),
      ),
  );
  const refresh = async () => {
    const [reviewRows, productRows] = await Promise.all([
      api("/admin/reviews"),
      api("/products?admin=1"),
    ]);
    setReviews(reviewRows);
    setProducts(productRows);
  };
  useEffect(() => {
    refresh().catch((e) => setMessage(e.message));
  }, []);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await api(`/admin/reviews${editing ? `/${editing}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: { ...form, productId: form.productId || null },
      });
      setForm(empty);
      setProductSearch("");
      setEditing(null);
      await refresh();
      setMessage("Review saved.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(review) {
    if (!window.confirm(`Delete the review by ${review.author}?`)) return;
    setBusy(true);
    try {
      await api(`/admin/reviews/${review.id}`, { method: "DELETE" });
      if (editing === review.id) {
        setEditing(null);
        setForm(empty);
        setProductSearch("");
      }
      await refresh();
      setMessage("Review deleted.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h1>Reviews</h1>
      <p>
        Published reviews appear in “The Crowd Has Spoken” on the homepage.
        Drafts remain private.
      </p>
      <p role="status">{message}</p>
      <form className="panel" onSubmit={save}>
        <h2>{editing ? "Edit review" : "Create review"}</h2>
        <label className="admin-product-search">
          Search products
          <input
            type="search"
            value={productSearch}
            placeholder="Search by product name, SKU or category"
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <small>
            {filteredProducts.length} product
            {filteredProducts.length === 1 ? "" : "s"} found
          </small>
        </label>
        <label>
          Product
          <select
            required
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
          >
            <option value="" disabled>
              Select a product
            </option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
        </label>
        <label>
          Reviewer name
          <input
            required
            maxLength="80"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </label>
        <label>
          Rating
          <select
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        </label>
        <label>
          Review text
          <textarea
            required
            maxLength="2000"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />{" "}
          Publish review
        </label>
        <button className="button gold" disabled={busy}>
          Save review
        </button>
        {editing && (
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setEditing(null);
              setForm(empty);
              setProductSearch("");
            }}
          >
            Cancel editing
          </button>
        )}
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Reviewer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Review</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.author}</td>
                <td>
                  {products.find((product) => product.id === r.productId)
                    ?.name || "Unassigned"}
                </td>
                <td>{r.rating}/5</td>
                <td>{r.published ? "Published" : "Draft"}</td>
                <td style={{ maxWidth: 400, overflowWrap: "anywhere" }}>
                  {r.text}
                </td>
                <td>
                  <button
                    disabled={busy}
                    onClick={() => {
                      setEditing(r.id);
                      setProductSearch("");
                      setForm({
                        productId: r.productId || "",
                        author: r.author,
                        text: r.text,
                        rating: r.rating,
                        published: r.published,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button disabled={busy} onClick={() => remove(r)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!reviews.length && <p>No reviews yet. Create the first review above.</p>}
    </>
  );
}
