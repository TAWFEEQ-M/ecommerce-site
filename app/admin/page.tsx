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

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState("");
  const [uploading, setUploading] = useState(false);

  const cloudName = "dc8wie32s";
  const uploadPreset = "ecommerce_upload";

  const formatDate = (dateValue: any) => {
    if (!dateValue) return "No date";
    if (typeof dateValue === "string") return dateValue;
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
        alert("Image Uploaded ✔");
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
    setEditingId("");
  };

  const addProduct = async () => {
    if (!name || !price || !image) {
      alert("Please enter name, price and upload image");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), {
          name,
          price,
          image,
          description,
          updatedAt: new Date(),
        });

        alert("Product Updated ✔");
      } else {
        await addDoc(collection(db, "products"), {
          name,
          price,
          image,
          description,
          createdAt: new Date(),
        });

        alert("Product Added ✔");
      }

      clearForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Error saving product");
    }
  };

  const editProduct = (product: any) => {
    setEditingId(product.id);
    setName(product.name || "");
    setPrice(product.price || "");
    setImage(product.image || "");
    setDescription(product.description || "");
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      alert("Product Deleted ✔");
      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Error deleting product");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
      alert(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Error updating order");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-5">
        <div className="bg-white text-black rounded-3xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-bold mb-3">Admin Login</h1>

          <p className="text-gray-600 mb-8">
            Enter admin password
          </p>

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-4 rounded-xl w-full outline-none focus:ring-2 focus:ring-black text-black"
          />

          <button
            onClick={adminLogin}
            className="bg-black text-white w-full py-4 rounded-xl mt-5 font-bold hover:bg-gray-800"
          >
            Login
          </button>

          <a
            href="/"
            className="block text-center mt-5 text-gray-600 hover:text-black"
          >
            Back to Store
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="uppercase tracking-[4px] text-gray-500 mb-3">
              Store Management
            </p>

            <h1 className="text-5xl font-extrabold">
              Admin Dashboard
            </h1>

            <p className="text-gray-600 mt-4 text-lg">
              Add products, manage inventory and track customer orders.
            </p>
          </div>

          <a
            href="/"
            className="bg-black text-white px-6 py-3 rounded-full"
          >
            Back to Store
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-black text-white rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-bold mb-6">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-xl outline-none text-white placeholder-gray-300"
              />

              <input
                type="number"
                placeholder="Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-xl outline-none text-white placeholder-gray-300"
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file);
                }}
                className="bg-white/10 border border-white/20 p-4 rounded-xl outline-none text-white"
              />

              {uploading && (
                <p className="text-yellow-400">
                  Uploading image...
                </p>
              )}

              {image && (
                <img
                  src={image}
                  alt="Uploaded product"
                  className="w-40 h-40 object-cover rounded-2xl border border-white/20"
                />
              )}

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white/10 border border-white/20 p-4 rounded-xl outline-none h-36 text-white placeholder-gray-300"
              />

              <button
                onClick={addProduct}
                className="bg-yellow-400 text-black py-4 rounded-xl text-lg font-bold hover:bg-yellow-300 transition"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  onClick={clearForm}
                  className="border border-white text-white py-4 rounded-xl hover:bg-white hover:text-black transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white text-black rounded-3xl shadow-2xl p-10">
            <h2 className="text-4xl font-bold mb-6">Products</h2>

            {products.length === 0 ? (
              <p className="text-gray-600">No products added yet.</p>
            ) : (
              <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-100 text-black rounded-2xl p-5 flex gap-5 items-center"
                  >
                    <img
                      src={product.image || "https://picsum.photos/300"}
                      alt={product.name || "Product"}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h3 className="text-xl font-bold">
                        {product.name}
                      </h3>

                      <p className="text-gray-600">₹{product.price}</p>

                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => editProduct(product)}
                          className="bg-black text-white px-4 py-2 rounded-full"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white text-black rounded-3xl shadow-2xl p-10 mt-12">
          <h2 className="text-4xl font-bold mb-8">
            Customer Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet.</p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-100 rounded-3xl p-8"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold">
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
                      <p className="text-gray-500">Order Date</p>

                      <p className="font-bold">
                        {formatDate(order.createdAt)}
                      </p>

                      <p className="text-3xl font-extrabold mt-4">
                        ₹{order.total || 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <span className="font-bold">Status:</span>

                    <span className="ml-3 px-4 py-2 rounded-full bg-black text-white">
                      {order.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {["Pending", "Packed", "Shipped", "Delivered", "Cancelled"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            updateOrderStatus(order.id, status)
                          }
                          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-xl font-bold mb-4">
                      Ordered Products
                    </h4>

                    <div className="space-y-3">
                      {order.products?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="flex justify-between bg-white text-black rounded-xl p-4"
                          >
                            <span>{item.name}</span>
                            <span className="font-bold">₹{item.price}</span>
                          </div>
                        )
                      )}
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