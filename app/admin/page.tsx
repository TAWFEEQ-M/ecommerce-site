"use client";

import { useState } from "react";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("Floor Tiles");
  const [material, setMaterial] = useState("Ceramic");
  const [stock, setStock] = useState("");
  const [colors, setColors] = useState("");

  const [editingId, setEditingId] = useState("");
  const [uploading, setUploading] = useState(false);

  const cloudName = "dc8wie32s";
  const uploadPreset = "ecommerce_upload";

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "No date";

    if (typeof dateValue === "string") {
      return dateValue;
    }

    if (dateValue.seconds) {
      return new Date(dateValue.seconds * 1000).toLocaleString();
    }

    return "No date";
  };

  const adminLogin = () => {
    if (password === "admin123") {
      setLoggedIn(true);
      fetchProducts();
      fetchOrders();
    } else {
      alert("Wrong password");
    }
  };

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));

    const productList: any[] = [];

    querySnapshot.forEach((item) => {
      productList.push({
        id: item.id,
        ...item.data(),
      });
    });

    setProducts(productList);
  };

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));

    const orderList: any[] = [];

    querySnapshot.forEach((item) => {
      orderList.push({
        id: item.id,
        ...item.data(),
      });
    });

    setOrders(orderList);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        setImage(data.secure_url);
        alert("Tile Image Uploaded ✔");
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.log(error);
      alert("Image upload error");
    }

    setUploading(false);
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setCategory("Floor Tiles");
    setMaterial("Ceramic");
    setStock("");
    setColors("");
    setEditingId("");
  };

  const addProduct = async () => {
    if (!name || !price || !image || !category || !material || !stock) {
      alert("Please fill tile name, price, image, category, material and stock");
      return;
    }

    const productData = {
      name,
      price,
      image,
      description,
      category,
      material,
      stock,
      colors: colors
        .split(",")
        .map((color) => color.trim())
        .filter((color) => color !== ""),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          ...productData,
          updatedAt: new Date(),
        });

        alert("Tile Updated ✔");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date(),
        });

        alert("Tile Added ✔");
      }

      clearForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Error saving tile");
    }
  };

  const editProduct = (product: any) => {
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(product.price || "");
    setImage(product.image || "");
    setDescription(product.description || "");
    setCategory(product.category || "Floor Tiles");
    setMaterial(product.material || "Ceramic");
    setStock(product.stock || "");
    setColors(product.colors?.join(", ") || "");
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this tile product?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      alert("Tile Deleted ✔");
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Error deleting tile");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status,
      });

      alert(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Error updating order");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-gray-950 text-white flex items-center justify-center px-5 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000')] bg-cover bg-center"></div>

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl p-10 w-full max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-red-700 flex items-center justify-center shadow-2xl">
              <h1 className="text-3xl font-extrabold text-white">
                AMC
              </h1>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold leading-tight">
                AMC Tiles
              </h1>

              <p className="text-gray-300 text-lg">
                & Traders Admin
              </p>
            </div>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">
            Manage premium floor tiles, wall tiles, bathroom tiles, kitchen
            tiles, outdoor tiles and customer orders.
          </p>

          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/10 border border-white/20 p-5 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-300"
          />

          <button
            onClick={adminLogin}
            className="w-full mt-6 bg-red-700 hover:bg-red-600 transition py-5 rounded-2xl text-lg font-bold shadow-2xl"
          >
            Login to Dashboard
          </button>

          <a
            href="/"
            className="block text-center mt-6 text-gray-300 hover:text-white transition"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-black px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 bg-white rounded-[32px] shadow-xl p-8 border border-red-100">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-red-700 flex items-center justify-center shadow-xl">
              <h1 className="text-3xl font-extrabold text-white">
                AMC
              </h1>
            </div>

            <div>
              <p className="uppercase tracking-[4px] text-red-700 mb-2 font-semibold">
                Tiles Store Management
              </p>

              <h1 className="text-4xl lg:text-5xl font-extrabold">
                AMC Tiles & Traders
              </h1>

              <p className="text-gray-600 mt-3 text-lg">
                Manage tile collections, pricing, category, material, stock,
                colours and customer orders.
              </p>
            </div>
          </div>

          <a
            href="/"
            className="bg-red-700 text-white px-7 py-4 rounded-full font-bold hover:bg-red-800 transition"
          >
            Back to Website
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-black text-white rounded-[36px] p-10 shadow-2xl">
            <p className="uppercase tracking-[4px] text-red-400 mb-3">
              Tile Collection
            </p>

            <h2 className="text-4xl font-extrabold mb-8">
              {editingId ? "Edit Tile Product" : "Add New Tile"}
            </h2>

            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Tile Name / Collection Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-red-500"
              />

              <input
                type="number"
                placeholder="Price per box / sq.ft"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-red-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white focus:ring-2 focus:ring-red-500"
              >
                <option className="text-black">Bathroom Tiles</option>
                <option className="text-black">Kitchen Tiles</option>
                <option className="text-black">Floor Tiles</option>
                <option className="text-black">Roof Tiles</option>
                <option className="text-black">Outdoor Tiles</option>
                <option className="text-black">Wall Tiles</option>
              </select>

              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white focus:ring-2 focus:ring-red-500"
              >
                <option className="text-black">Ceramic</option>
                <option className="text-black">Vitrified</option>
                <option className="text-black">Porcelain</option>
                <option className="text-black">Marble</option>
                <option className="text-black">Granite</option>
                <option className="text-black">Mosaic</option>
              </select>

              <input
                type="number"
                placeholder="Stock Available"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-red-500"
              />

              <input
                type="text"
                placeholder="Available Colours e.g. White, Grey, Brown"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white placeholder-gray-300 focus:ring-2 focus:ring-red-500"
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none text-white"
              />

              {uploading && (
                <p className="text-red-400 font-semibold">
                  Uploading tile image...
                </p>
              )}

              {image && (
                <img
                  src={image}
                  alt="Uploaded tile"
                  className="w-44 h-44 object-cover rounded-3xl border border-white/20 shadow-xl"
                />
              )}

              <textarea
                placeholder="Tile Description — size, finish, usage, quality, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-2xl outline-none h-36 text-white placeholder-gray-300 focus:ring-2 focus:ring-red-500"
              />

              <button
                onClick={addProduct}
                className="bg-red-700 text-white py-4 rounded-2xl text-lg font-bold hover:bg-red-600 transition shadow-lg"
              >
                {editingId ? "Update Tile" : "Add Tile"}
              </button>

              {editingId && (
                <button
                  onClick={clearForm}
                  className="border border-white text-white py-4 rounded-2xl hover:bg-white hover:text-black transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white text-black rounded-[36px] shadow-2xl p-10 border border-red-100">
            <h2 className="text-4xl font-extrabold mb-3">
              Tile Products
            </h2>

            <p className="text-gray-600 mb-6">
              Search, edit or remove existing tile collections.
            </p>

            <input
              type="text"
              placeholder="Search tile products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-2xl mb-6 outline-none focus:ring-2 focus:ring-red-700"
            />

            {products.length === 0 ? (
              <p className="text-gray-600">
                No tile products added yet.
              </p>
            ) : (
              <div className="space-y-5 max-h-[650px] overflow-y-auto pr-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#f7f3ee] text-black rounded-3xl p-5 flex gap-5 items-center border border-red-100"
                  >
                    <img
                      src={product.image || "https://picsum.photos/300"}
                      alt={product.name || "Tile Product"}
                      className="w-28 h-28 object-cover rounded-2xl shadow"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-extrabold">
                        {product.name}
                      </h3>

                      <p className="text-red-700 font-bold mt-1">
                        ₹{product.price}
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        {product.category || "No category"} •{" "}
                        {product.material || "No material"}
                      </p>

                      <p className="text-gray-600 text-sm mt-1">
                        Stock:{" "}
                        <span
                          className={
                            Number(product.stock) > 0
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {Number(product.stock) > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.colors?.map((color: string, index: number) => (
                          <span
                            key={index}
                            className="border border-gray-300 px-3 py-1 rounded-full text-xs bg-white"
                          >
                            {color}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => editProduct(product)}
                          className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-700 text-white px-5 py-2 rounded-full hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="text-gray-600">
                    No matching tile products found.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white text-black rounded-[36px] shadow-2xl p-10 mt-12 border border-red-100">
          <h2 className="text-4xl font-extrabold mb-3">
            Customer Tile Orders
          </h2>

          <p className="text-gray-600 mb-8">
            Track customer orders and update tile delivery progress.
          </p>

          {orders.length === 0 ? (
            <p className="text-gray-600">
              No customer orders yet.
            </p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-[#f7f3ee] rounded-3xl p-8 border border-red-100"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-extrabold">
                        {order.customerName || "Unknown Customer"}
                      </h3>

                      <p className="text-gray-600 mt-2">
                        📞 {order.phone || "No phone"}
                      </p>

                      <p className="text-gray-600 mt-1">
                        📍 {order.address || "No address"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500">
                        Order Date
                      </p>

                      <p className="font-bold">
                        {formatDate(order.createdAt)}
                      </p>

                      <p className="text-3xl font-extrabold mt-4 text-red-700">
                        ₹{order.total || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="font-bold">
                      Status:
                    </span>

                    <span className="ml-3 px-5 py-2 rounded-full bg-red-700 text-white font-bold">
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {[
                      "Pending",
                      "Packed",
                      "Shipped",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateOrderStatus(order.id, status)}
                        className="bg-black text-white px-5 py-2 rounded-full hover:bg-red-700 transition"
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-xl font-extrabold mb-4">
                      Ordered Tiles
                    </h4>

                    <div className="space-y-3">
                      {order.products?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between bg-white text-black rounded-2xl p-4 border border-red-100"
                        >
                          <span>{item.name}</span>

                          <span className="font-bold text-red-700">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}