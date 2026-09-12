import React, { useEffect, useState } from "react";
import { api } from "../../services/api";

const empty = { author: "", text: "", rating: 5, published: false };
export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]),
    [form, setForm] = useState(empty),
    [editing, setEditing] = useState(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const refresh = () => api("/admin/reviews").then(setReviews);
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
        body: form,
      });
      setForm(empty);
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
          Publish on homepage
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
                      setForm({
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
