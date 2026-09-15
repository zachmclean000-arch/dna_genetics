import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useApp } from "../../hooks/context";
import { api } from "../../services/api";

function AdminLogin() {
  const { setUser } = useApp();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await api("/auth/login", {
        method: "POST",
        body: Object.fromEntries(new FormData(event.currentTarget)),
      });
      if (user.role !== "admin") {
        await api("/auth/logout", { method: "POST" });
        throw Error("This account does not have administrator access.");
      }
      setUser(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link
          className="admin-login-brand"
          to="/"
          aria-label="Return to storefront"
        >
          DNA <small>GENETICS</small>
        </Link>
        <p className="admin-login-kicker">WEBSITE MANAGEMENT</p>
        <h1>Admin login</h1>
        <p className="admin-login-copy">
          Enter your administrator credentials to continue to the dashboard.
        </p>
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}
          <button className="button gold" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <Link className="admin-login-store-link" to="/">
          ← Return to storefront
        </Link>
      </section>
    </main>
  );
}

export default function AdminLayout() {
  const { user, loading } = useApp();
  if (loading) return <p className="section">Checking access…</p>;
  if (user?.role !== "admin") return <AdminLogin />;
  const links = [
    ["Overview", ""],
    ["Products", "/products"],
    ["Inventory", "/inventory"],
    ["Categories", "/categories"],
    ["Orders", "/orders"],
    ["Customers", "/customers"],
    ["Promotions", "/promotions"],
    ["Reviews", "/reviews"],
    ["Settings", "/settings"],
  ];
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/">
          DNA <small>DNA GENETICS ADMIN</small>
        </Link>
        <nav>
          {links.map(([label, url]) => (
            <NavLink key={url} end to={`/admin${url}`}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to="/">← View storefront</Link>
      </aside>
      <main className="admin-main">
        <div className="admin-top">
          WEBSITE MANAGEMENT <span>{user.email}</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
