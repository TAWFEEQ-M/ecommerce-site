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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 text-black px-6 py-12">

        <div className="max-w-7xl mx-auto">

          <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-3xl p-10 mb-12 shadow-xl">

            <p className="uppercase tracking-[4px] text-gray-400 mb-3">
              Fresh Collection
            </p>

            <h1 className="text-5xl font-extrabold mb-4">
              Our Products
            </h1>

            <p className="text-gray-300 max-w-2xl text-lg">
              Discover premium products from our latest collection.
              Add your favourite items to cart and complete checkout
              in just a few clicks.
            </p>

          </div>

          {products.length === 0 ? (
            <div className="bg-white text-black rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold">
                No products found
              </h2>

              <p className="text-gray-600 mt-3">
                Please add products from the admin panel.
              </p>

              <a
                href="/admin"
                className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full"
              >
                Go to Admin
              </a>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={product.image}
                />
              ))}

            </div>
          )}

        </div>

      </div>
    </>
  );
}