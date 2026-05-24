"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
} from "firebase/firestore";

export default function Checkout() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] =
    useState("");

  const placeOrder = async () => {

    const cart =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

    const total = cart.reduce(
      (sum:number,item:any)=>
      sum + Number(item.price),
      0
    );

    const orderData = {
      shopName: "MyStore",
      shopPhone: "9876543210",
      shopAddress: "Chennai, Tamil Nadu",

      customerName: name,
      phone,
      address,

      products: cart,
      total,

      createdAt:
        new Date().toLocaleString(),

      status: "Pending",
    };

    try {

      await addDoc(
        collection(db, "orders"),
        orderData
      );

      localStorage.setItem(
        "latestOrder",
        JSON.stringify(orderData)
      );

      alert("Order Placed ✔");

      localStorage.removeItem("cart");

      window.location.href="/invoice";

    } catch (error) {

      console.log(error);

      alert("Error placing order");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black px-6 py-12">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <div className="bg-black text-white rounded-3xl p-10 shadow-2xl">

            <p className="uppercase tracking-[4px] text-gray-400 mb-4">
              Secure Checkout
            </p>

            <h1 className="text-5xl font-extrabold leading-tight">
              Complete Your Order
            </h1>

            <p className="text-gray-300 mt-6 text-lg leading-relaxed">
              Enter your delivery details carefully.
              Your order will be saved and an invoice
              will be generated after checkout.
            </p>

            <div className="mt-10 space-y-5">

              <div className="bg-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-xl">
                  Fast Delivery
                </h3>

                <p className="text-gray-300 mt-2">
                  Delivery details are shared with admin for processing.
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5">
                <h3 className="font-bold text-xl">
                  Invoice Included
                </h3>

                <p className="text-gray-300 mt-2">
                  Customer can download invoice PDF after placing order.
                </p>
              </div>

            </div>

          </div>

          <div className="bg-white text-black rounded-3xl shadow-2xl p-10">

            <h2 className="text-4xl font-bold mb-2">
              Delivery Details
            </h2>

            <p className="text-gray-500 mb-8">
              Fill all customer information below.
            </p>

            <div className="flex flex-col gap-5">

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-black"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e)=>
                  setPhone(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black text-black"
              />

              <textarea
                placeholder="Delivery Address"
                value={address}
                onChange={(e)=>
                  setAddress(e.target.value)
                }
                className="border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black h-36 text-black"
              />

              <button
                onClick={placeOrder}
                className="bg-black text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition shadow-lg"
              >
                Place Order
              </button>

              <a
                href="/cart"
                className="text-center border border-black text-black py-4 rounded-xl font-semibold hover:bg-black hover:text-white transition"
              >
                Back to Cart
              </a>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}