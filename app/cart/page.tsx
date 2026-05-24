"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

export default function Cart() {

  const [cart, setCart] =
    useState<any[]>([]);

  useEffect(() => {

    const cartItems =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

    setCart(cartItems);

  }, []);

  const removeItem = (
    indexToRemove:number
  ) => {

    const updatedCart =
      cart.filter(
        (_, index) =>
          index !== indexToRemove
      );

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price),
    0
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-6 py-12 text-black">

        <div className="max-w-7xl mx-auto">

          <div className="mb-12">

            <p className="uppercase tracking-[4px] text-gray-500 mb-3">
              Your Shopping Bag
            </p>

            <h1 className="text-5xl font-extrabold">
              Shopping Cart
            </h1>

            <p className="text-gray-600 mt-4 text-lg">
              Review your selected products and proceed to secure checkout.
            </p>

          </div>

          {cart.length === 0 ? (

            <div className="bg-white text-black rounded-3xl shadow-xl p-16 text-center">

              <h2 className="text-4xl font-bold mb-4">
                Your Cart is Empty
              </h2>

              <p className="text-gray-500 text-lg">
                Looks like you haven't added any products yet.
              </p>

              <a
                href="/products"
                className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                Continue Shopping
              </a>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* CART ITEMS */}

              <div className="lg:col-span-2 space-y-6">

                {cart.map((item, index) => (

                  <div
                    key={index}
                    className="bg-white text-black rounded-3xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center hover:shadow-2xl transition"
                  >

                    <img
                      src={
                        item.image ||
                        "https://picsum.photos/500"
                      }
                      alt={item.name}
                      className="w-40 h-40 object-cover rounded-2xl"
                    />

                    <div className="flex-1 w-full">

                      <h2 className="text-3xl font-bold">
                        {item.name}
                      </h2>

                      <p className="text-gray-500 mt-3">
                        Premium product with top quality and modern design.
                      </p>

                      <div className="flex items-center justify-between mt-6">

                        <p className="text-3xl font-extrabold">
                          ₹{item.price}
                        </p>

                        <button
                          onClick={() =>
                            removeItem(index)
                          }
                          className="bg-red-500 text-white px-5 py-3 rounded-full hover:bg-red-600 transition font-semibold"
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* ORDER SUMMARY */}

              <div>

                <div className="bg-white text-black rounded-3xl shadow-xl p-8 sticky top-10">

                  <h2 className="text-3xl font-bold mb-8">
                    Order Summary
                  </h2>

                  <div className="space-y-5">

                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">
                        Total Items
                      </span>

                      <span className="font-semibold">
                        {cart.length}
                      </span>
                    </div>

                    <div className="flex justify-between text-lg">
                      <span className="text-gray-600">
                        Delivery
                      </span>

                      <span className="font-semibold text-green-600">
                        Free
                      </span>
                    </div>

                    <div className="border-t pt-6 flex justify-between items-center">

                      <span className="text-2xl font-bold">
                        Total
                      </span>

                      <span className="text-4xl font-extrabold">
                        ₹{total}
                      </span>

                    </div>

                  </div>

                  <a
                    href="/checkout"
                    className="block text-center mt-10 bg-black text-white py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition shadow-lg"
                  >
                    Proceed to Checkout
                  </a>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>
    </>
  );
}