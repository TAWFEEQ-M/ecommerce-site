"use client";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [cartCount, setCartCount] =
    useState(0);

  useEffect(() => {

    const updateCartCount = () => {

      const cartItems =
        JSON.parse(
          localStorage.getItem("cart") || "[]"
        );

      setCartCount(cartItems.length);
    };

    updateCartCount();

    window.addEventListener(
      "focus",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "focus",
        updateCartCount
      );
    };

  }, []);

  return (
    <nav className="bg-black text-white px-8 py-5 flex justify-between items-center shadow-lg">

      <h1 className="text-2xl font-bold">
        MyStore
      </h1>

      <div className="flex gap-6 text-lg">

        <a href="/">
          Home
        </a>

        <a href="/products">
          Products
        </a>

        <a href="/cart">
          Cart ({cartCount})
        </a>

      </div>

    </nav>
  );
}