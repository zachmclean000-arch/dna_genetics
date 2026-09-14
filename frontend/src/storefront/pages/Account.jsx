import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../hooks/context";
import { api, money } from "../../services/api";
export default function Account() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, setUser, loading } = useApp(),
    [register, setRegister] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [orders, setOrders] = useState([]);
  useEffect(() => {
    if (user)
      api("/orders")
        .then(setOrders)
        .catch((e) => setError(e.message));
  }, [user]);
  if (loading) return <p className="section">Loading account…</p>;
  if (user)
    return (
      <section className="section">
        <p className="eyebrow">YOUR DNA GENETICS ACCOUNT</p>
        <h1>Welcome back.</h1>
        <p>{user.email}</p>
        <div className="actions">
          <button
            onClick={async () => {
              try {
                await api("/auth/logout", { method: "POST" });
                setUser(null);
                setOrders([]);
              } catch (e) {
                setError(e.message);
              }
            }}
          >
            Sign out
          </button>
          {user.role === "admin" && (
            <Link className="button gold" to="/admin">
              Open dashboard ↗
            </Link>
          )}
        </div>
        {error && <p role="alert">{error}</p>}
        <h2>Your simulated orders</h2>
        {orders.length ? (
          orders.map((o) => (
            <article className="order" key={o.id}>
              <strong>Order #{o.id.slice(0, 8)}</strong>
              <span>
                {new Date(o.createdAt).toLocaleDateString()} · {o.status}
              </span>
              <p>
                {o.items.map((i) => `${i.quantity} × ${i.name}${i.size ? ` (${i.size}-seed pack)` : ""}`).join(", ")}
              </p>
              <b>{money(o.total)}</b>
            </article>
          ))
        ) : (
          <p>
            No simulated orders yet.{" "}
            <Link to="/shop">Explore the catalogue.</Link>
          </p>
        )}
      </section>
    );
  return (
    <section className="section account">
      <p className="eyebrow">YOUR DNA ACCOUNT</p>
      <h1>{register ? "Create an account." : "Welcome back."}</h1>
      <p>Use a test email and a unique password for this school project.</p>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const body = Object.fromEntries(new FormData(e.currentTarget));
          try {
            setUser(
              await api(`/auth/${register ? "register" : "login"}`, {
                method: "POST",
                body,
              }),
            );
            if (params.get("returnTo") === "checkout") navigate("/checkout", { replace: true });
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Email
          <input type="email" name="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            minLength="12"
            maxLength="128"
            autoComplete={register ? "new-password" : "current-password"}
            required
          />
        </label>
        <small>At least 12 characters.</small>
        <button className="button gold" disabled={busy}>
          {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
        </button>
        <p className="error" role="alert">
          {error}
        </p>
      </form>
      <button
        className="text-button"
        onClick={() => {
          setRegister(!register);
          setError("");
        }}
      >
        {register
          ? "Already have an account? Sign in"
          : "New here? Create an account"}
      </button>
    </section>
  );
}
