import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import StorefrontLayout from "./storefront/layout/StorefrontLayout";
import Home from "./storefront/pages/Home";
import Shop from "./storefront/pages/Shop";
import ProductDetails from "./storefront/pages/ProductDetails";
import Account from "./storefront/pages/Account";
import Cart from "./storefront/pages/Cart";
import Information from "./storefront/pages/Information";
import About from "./storefront/pages/About";
import Promotions from "./storefront/pages/Promotions";
import UsefulPages from "./storefront/pages/UsefulPages";
import { ArticlePage, LocationsPage } from "./storefront/pages/Articles";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminPages from "./admin/pages/AdminPages";
import ProductEditor from "./admin/pages/ProductEditor";
import ReviewsAdmin from "./admin/pages/ReviewsAdmin";
export default function App() {
  const { pathname, search } = useLocation();
  React.useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, search]);
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/search/:query" element={<Shop />} />
        <Route path="shop/:catalogueSlug" element={<Shop />} />
        <Route path="about" element={<About />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="promos" element={<Promotions />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="product/:slug/:packSize" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Cart checkout />} />
        <Route path="account" element={<Account />} />
        <Route path="articles/:slug" element={<ArticlePage />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="locations/:city" element={<LocationsPage />} />
        {[
          "best-indica-autoflower-seeds",
          "best-feminized-seeds",
          "best-autoflower-seeds",
          "feminized-seeds-vs-regular-seeds",
          "autoflower-vs-feminized",
          "seeds-vs-clones",
        ].map((slug) => (
          <Route key={slug} path={slug} element={<ArticlePage />} />
        ))}
        {[
          "faqs",
          "shipping-information",
          "returns-refund-policy",
          "privacy",
          "terms-conditions",
          "loyalty-dna-points",
          "contact",
          "cannabis-seed-brochure",
        ].map((p) => (
          <Route key={p} path={p} element={<UsefulPages />} />
        ))}
        <Route path="*" element={<Information />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminPages />} />
        <Route path="reviews" element={<ReviewsAdmin />} />
        {[
          "products",
          "categories",
          "inventory",
          "orders",
          "customers",
          "promotions",
          "settings",
        ].map((p) => (
          <Route key={p} path={p} element={<AdminPages />} />
        ))}
        <Route path="products/create" element={<ProductEditor />} />
        <Route path="products/:id/edit" element={<ProductEditor />} />
      </Route>
    </Routes>
  );
}
