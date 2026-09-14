import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useApp } from "../../hooks/context";
export default function AdminLayout() {
  const { user, loading } = useApp();
  if (loading) return <p className="section">Checking access…</p>;
  if (user?.role !== "admin")
    return (
      <section className="section">
        <h1>Administrator access required.</h1>
        <p>
          Sign in with an administrator account to manage this demonstration
          project.
        </p>
        <Link className="button gold" to="/account">
          Go to sign in
        </Link>
      </section>
    );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/">
          DNA <small>DNA GENETICS ADMIN</small>
        </Link>
        <nav>
          {[
            ["Overview", ""],
            ["Products", "/products"],
            ["Inventory", "/inventory"],
            ["Categories", "/categories"],
            ["Orders", "/orders"],
            ["Customers", "/customers"],
            ["Promotions", "/promotions"],
            ["Reviews", "/reviews"],
            ["Settings", "/settings"],
          ].map(([label, url]) => (
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
