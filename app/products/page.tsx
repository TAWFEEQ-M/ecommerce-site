"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    const querySnapshot =
      await getDocs(
        collection(db, "products")
      );

    const productList:any[] = [];

    querySnapshot.forEach((doc) => {

      productList.push({
        id: doc.id,
        ...doc.data(),
      });

    });

    setProducts(productList);
  };

  const filteredProducts =
    products.filter((product)=>
      product.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div className="min-h-screen bg-gray-100 px-8 py-12">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          Our Products
        </h1>

        <p className="text-gray-600 mb-8">
          Discover the latest products available in our store.
        </p>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className="w-full p-4 rounded-2xl border border-gray-300 mb-10 outline-none focus:ring-2 focus:ring-black text-black"
        />

        {filteredProducts.length === 0 ? (

          <p>No products found</p>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProducts.map((product)=>(
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
  );
}