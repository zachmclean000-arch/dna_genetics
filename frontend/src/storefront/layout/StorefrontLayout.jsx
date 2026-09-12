import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./chrome.css";
export default function StorefrontLayout() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
