"use client";

type ProductProps = {
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({
  name,
  price,
  image,
}: ProductProps) {

  const addToCart = () => {

    const product = {
      name,
      price,
      image,
    };

    const existingCart =
      JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

    existingCart.push(product);

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert("Added to cart ✔");
  };

  return (

    <div className="bg-white text-black rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-gray-200">

      <div className="relative overflow-hidden">

        <img
          src={
            image ||
            "https://picsum.photos/500"
          }
          alt={name}
          className="w-full h-72 object-cover hover:scale-110 transition duration-500"
        />

        <div className="absolute top-4 left-4 bg-yellow-400 text-black text-sm font-bold px-4 py-1 rounded-full shadow">
          New
        </div>

      </div>

      <div className="p-6">

        <h2 className="text-2xl font-bold line-clamp-1">
          {name}
        </h2>

        <p className="text-gray-500 mt-3 leading-relaxed">

          Premium quality product with modern
          design and excellent customer
          satisfaction.

        </p>

        <div className="flex items-center justify-between mt-8">

          <div>

            <p className="text-sm text-gray-400">
              Price
            </p>

            <p className="text-3xl font-extrabold text-black">
              ₹{price}
            </p>

          </div>

          <button
            onClick={addToCart}
            className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition shadow-lg"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}