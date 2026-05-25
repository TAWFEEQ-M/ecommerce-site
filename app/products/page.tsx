"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

import { db } from "@/lib/firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

export default function Products() {
  const [products, setProducts] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const [material, setMaterial] =
    useState("All");

  const [priceRange, setPriceRange] =
    useState("All");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const querySnapshot =
      await getDocs(
        collection(db, "products")
      );

    const productList: any[] = [];

    querySnapshot.forEach((doc) => {
      productList.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setProducts(productList);
  };

  const filteredProducts =
    products.filter((product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productCategory =
        product.category || "";

      const productMaterial =
        product.material || "";

      const productPrice =
        Number(product.price || 0);

      const matchesSearch =
        productName.includes(
          search.toLowerCase()
        );

      const matchesCategory =
        category === "All" ||
        productCategory === category;

      const matchesMaterial =
        material === "All" ||
        productMaterial === material;

      const matchesPrice =
        priceRange === "All" ||
        (
          priceRange === "Below 500" &&
          productPrice < 500
        ) ||
        (
          priceRange === "500 - 1000" &&
          productPrice >= 500 &&
          productPrice <= 1000
        ) ||
        (
          priceRange === "Above 1000" &&
          productPrice > 1000
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaterial &&
        matchesPrice
      );
    });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f7f3ee] text-black px-6 py-12">

        <div className="max-w-7xl mx-auto">

          <div className="bg-gradient-to-r from-red-950 via-black to-gray-900 text-white rounded-[40px] p-10 mb-10 shadow-2xl overflow-hidden relative">

            <div className="absolute right-0 top-0 w-80 h-80 bg-red-700/30 blur-3xl rounded-full"></div>

            <div className="relative z-10">

              <p className="uppercase tracking-[5px] text-red-300 mb-4">
                AMC Tiles & Traders
              </p>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                Premium Tile Collections
              </h1>

              <p className="text-gray-300 mt-5 max-w-3xl text-lg leading-relaxed">
                Explore bathroom tiles, kitchen tiles, floor tiles,
                roof tiles, outdoor tiles and wall tiles in different
                materials, colours and price ranges.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">

            {[
              "All",
              "Bathroom Tiles",
              "Kitchen Tiles",
              "Floor Tiles",
              "Roof Tiles",
              "Outdoor Tiles",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={
                  category === item
                    ? "bg-red-700 text-white rounded-2xl px-4 py-4 font-bold shadow-lg"
                    : "bg-white text-black rounded-2xl px-4 py-4 font-bold shadow hover:bg-red-50"
                }
              >
                {item}
              </button>
            ))}

          </div>

          <div className="bg-white rounded-[32px] shadow-xl p-6 mb-12 border border-red-100">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Search tiles..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-700"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-700"
              >
                <option>All</option>
                <option>Bathroom Tiles</option>
                <option>Kitchen Tiles</option>
                <option>Floor Tiles</option>
                <option>Roof Tiles</option>
                <option>Outdoor Tiles</option>
                <option>Wall Tiles</option>
              </select>

              <select
                value={material}
                onChange={(e) =>
                  setMaterial(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-700"
              >
                <option>All</option>
                <option>Ceramic</option>
                <option>Vitrified</option>
                <option>Porcelain</option>
                <option>Marble</option>
                <option>Granite</option>
                <option>Mosaic</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) =>
                  setPriceRange(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-700"
              >
                <option>All</option>
                <option>Below 500</option>
                <option>500 - 1000</option>
                <option>Above 1000</option>
              </select>

            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">

            <div>

              <h2 className="text-4xl font-extrabold">
                Available Tiles
              </h2>

              <p className="text-gray-600 mt-2">
                Showing {filteredProducts.length} tile products
              </p>

            </div>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaterial("All");
                setPriceRange("All");
              }}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
            >
              Clear Filters
            </button>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="bg-white text-black rounded-[32px] shadow-xl p-12 text-center border border-red-100">

              <h2 className="text-3xl font-extrabold">
                No matching tiles found
              </h2>

              <p className="text-gray-600 mt-3">
                Try changing the category, material, price range or search keyword.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image}
                  category={product.category}
                  material={product.material}
                  stock={product.stock}
                  colors={product.colors || []}
                />
              ))}

            </div>

          )}

        </div>

      </div>
    </>
  );
}