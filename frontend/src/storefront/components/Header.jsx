import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../hooks/context";
import MegaMenu from "./MegaMenu";
import Icon from "./Icon";
import { navigation } from "../../data/navigation";
import { searchPath } from "../../data/catalogueRoutes";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [search, setSearch] = useState(false);
  const { cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const root = useRef(null),
    menuButton = useRef(null),
    searchButton = useRef(null),
    searchInput = useRef(null);
  const close = () => {
    setOpen(false);
    setMega(false);
    setSearch(false);
  };
  useEffect(close, [location.pathname, location.search]);
  useEffect(() => {
    const dismiss = (event) => {
      if (event.type === "keydown" && event.key === "Escape") {
        close();
        (search ? searchButton : menuButton).current?.focus();
      } else if (
        event.type === "pointerdown" &&
        !root.current?.contains(event.target)
      )
        close();
    };
    document.addEventListener("keydown", dismiss);
    document.addEventListener("pointerdown", dismiss);
    return () => {
      document.removeEventListener("keydown", dismiss);
      document.removeEventListener("pointerdown", dismiss);
    };
  }, [search]);
  useEffect(() => {
    if (search) searchInput.current?.focus();
  }, [search]);
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 991px)").matches) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  return (
    <div
      className="dna-header-shell"
      ref={root}
      onBlur={(event) => {
        if (event.relatedTarget && !root.current?.contains(event.relatedTarget))
          close();
      }}
    >
      <div className="dna-announcement">
        FREE SHIPPING ON ORDERS <span>£120</span> AND OVER
      </div>
      <header className="dna-header">
        <div className="dna-header-inner">
          <Link className="dna-brand" to="/" aria-label="DNA Genetics home">
            <img
              src="/assets/images/logo/site-logo.webp"
              alt="DNA Genetics"
              width="60"
              height="47"
            />
          </Link>
          <button
            ref={menuButton}
            className={`dna-menu-toggle ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="dna-navigation"
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
              setMega(false);
              setSearch(false);
            }}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            id="dna-navigation"
            className={`dna-navigation ${open ? "is-open" : ""}`}
            aria-label="Main navigation"
          >
            <div
              className="dna-shop-trigger"
              onMouseEnter={() => {
                if (window.matchMedia("(min-width: 992px)").matches)
                  setMega(true);
              }}
              onMouseLeave={() => {
                if (window.matchMedia("(min-width: 992px)").matches)
                  setMega(false);
              }}
            >
              <button
                className="dna-nav-link"
                aria-expanded={mega}
                aria-controls="dna-mega-menu"
                onClick={() => {
                  setMega(
                    window.matchMedia("(min-width: 992px)").matches
                      ? true
                      : !mega,
                  );
                  setSearch(false);
                }}
              >
                Shop All Seeds <Icon name="angleDown" />
              </button>
              {mega && (
                <MegaMenu onBack={() => setMega(false)} onNavigate={close} />
              )}
            </div>
            {navigation.map(([label, to]) => (
              <Link className="dna-nav-link" key={to} to={to}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="dna-header-actions">
            <button
              ref={searchButton}
              aria-label={search ? "Close search" : "Search"}
              aria-expanded={search}
              aria-controls="dna-search"
              onClick={() => {
                setSearch(!search);
                setOpen(false);
                setMega(false);
              }}
            >
              <Icon name={search ? "close" : "search"} />
            </button>
            <Link
              to="/cart"
              className="dna-cart"
              aria-label={`Cart, ${cart.reduce((n, i) => n + i.quantity, 0)} items`}
            >
              <Icon name="cart" />
              <span className="dna-cart-count">
                {cart.reduce((n, i) => n + i.quantity, 0)}
              </span>
            </Link>
          </div>
        </div>
        {search && (
          <form
            id="dna-search"
            className="dna-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              const q = new FormData(event.currentTarget).get("q").trim();
              navigate(q ? searchPath(q) : "/shop");
              close();
            }}
          >
            <input
              ref={searchInput}
              name="q"
              aria-label="Search catalogue"
              placeholder="Search anything you like.."
            />
            <button aria-label="Submit search">
              <Icon name="search" />
            </button>
          </form>
        )}
      </header>
      {!open && (
        <nav className="dna-mobile-links" aria-label="Quick navigation">
          <button
            onClick={() => {
              setOpen(true);
              setMega(true);
            }}
          >
            Shop All Seeds <Icon name="angleRight" />
          </button>
          {navigation.map(([label, to]) => (
            <Link key={to} to={to}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
