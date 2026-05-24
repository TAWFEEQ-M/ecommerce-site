"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

import jsPDF from "jspdf";

export default function Invoice() {

  const [order, setOrder] =
    useState<any>(null);

  useEffect(() => {

    const savedOrder =
      JSON.parse(
        localStorage.getItem("latestOrder")
        || "null"
      );

    setOrder(savedOrder);

  }, []);

  const downloadInvoice = () => {

    const doc = new jsPDF();

    const shopName =
      String(order.shopName || "MyStore");

    const shopPhone =
      String(order.shopPhone || "9876543210");

    const shopAddress =
      String(order.shopAddress || "Chennai");

    doc.setFontSize(24);
    doc.text(shopName, 20, 20);

    doc.setFontSize(11);
    doc.text(`Phone: ${shopPhone}`, 20, 30);
    doc.text(`Address: ${shopAddress}`, 20, 38);

    doc.line(20, 45, 190, 45);

    doc.setFontSize(20);
    doc.text("INVOICE", 20, 58);

    doc.setFontSize(12);
    doc.text(
      `Customer: ${String(order.customerName || "")}`,
      20,
      72
    );
    doc.text(
      `Phone: ${String(order.phone || "")}`,
      20,
      80
    );
    doc.text(
      `Address: ${String(order.address || "")}`,
      20,
      88
    );
    doc.text(
      `Date: ${String(order.createdAt || "")}`,
      20,
      96
    );

    doc.line(20, 104, 190, 104);

    doc.setFontSize(14);
    doc.text("Products", 20, 115);

    let y = 127;

    order.products.forEach(
      (item:any,index:number) => {

        doc.setFontSize(12);

        doc.text(
          `${index + 1}. ${String(item.name || "")}`,
          20,
          y
        );

        doc.text(
          `Rs.${String(item.price || 0)}`,
          160,
          y
        );

        y += 10;
      }
    );

    doc.line(20, y + 5, 190, y + 5);

    doc.setFontSize(16);
    doc.text(
      `Total Amount: Rs.${String(order.total || 0)}`,
      20,
      y + 18
    );

    doc.save("invoice.pdf");
  };

  if (!order) {

    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">

          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

            <h1 className="text-3xl font-bold">
              No Invoice Found
            </h1>

            <p className="text-gray-500 mt-3">
              Please place an order first.
            </p>

            <a
              href="/products"
              className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-full"
            >
              Go to Products
            </a>

          </div>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black px-6 py-12">

        <div className="max-w-5xl mx-auto">

          <div className="mb-10">

            <p className="uppercase tracking-[4px] text-gray-500 mb-3">
              Order Confirmed
            </p>

            <h1 className="text-5xl font-extrabold">
              Invoice Generated
            </h1>

            <p className="text-gray-600 mt-4 text-lg">
              Your order has been placed successfully. Download your invoice PDF below.
            </p>

          </div>

          <div className="bg-white text-black rounded-3xl shadow-2xl overflow-hidden">

            <div className="bg-black text-white p-10">

              <h1 className="text-4xl font-extrabold">
                {order.shopName || "MyStore"}
              </h1>

              <p className="text-gray-300 mt-3">
                Phone: {order.shopPhone || "9876543210"}
              </p>

              <p className="text-gray-300">
                Address: {order.shopAddress || "Chennai"}
              </p>

            </div>

            <div className="p-10">

              <div className="flex justify-between items-start flex-col md:flex-row gap-6 border-b pb-8">

                <div>

                  <h2 className="text-3xl font-bold mb-4">
                    Customer Details
                  </h2>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.customerName}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {order.address}
                  </p>

                </div>

                <div className="bg-gray-100 rounded-2xl p-5">

                  <p className="text-gray-500">
                    Invoice Date
                  </p>

                  <p className="font-bold">
                    {order.createdAt}
                  </p>

                </div>

              </div>

              <h3 className="text-3xl font-bold mt-10 mb-6">
                Products Purchased
              </h3>

              <div className="space-y-4">

                {order.products.map(
                  (item:any,index:number)=>(
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 rounded-2xl p-5"
                    >

                      <div>
                        <p className="font-bold text-lg">
                          {item.name}
                        </p>

                        <p className="text-gray-500">
                          Product #{index + 1}
                        </p>
                      </div>

                      <p className="text-2xl font-bold">
                        ₹{item.price}
                      </p>

                    </div>
                  )
                )}

              </div>

              <div className="flex justify-between items-center border-t mt-10 pt-8">

                <span className="text-3xl font-bold">
                  Total
                </span>

                <span className="text-4xl font-extrabold">
                  ₹{order.total}
                </span>

              </div>

              <div className="flex flex-wrap gap-4 mt-10">

                <button
                  onClick={downloadInvoice}
                  className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition"
                >
                  Download Invoice PDF
                </button>

                <a
                  href="/products"
                  className="border border-black text-black px-8 py-4 rounded-full font-bold hover:bg-black hover:text-white transition"
                >
                  Continue Shopping
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}