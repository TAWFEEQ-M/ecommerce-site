"use client";

type ProductProps = {
  name: string;
  price: number;
  image: string;
  category?: string;
  material?: string;
  stock?: string;
  colors?: string[];
};

export default function ProductCard({
  name,
  price,
  image,
  category,
  material,
  stock,
  colors = [],
}: ProductProps) {

  const addToCart = () => {

    const product = {
      name,
      price,
      image,
      category,
      material,
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

    <div className="bg-white text-black rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition border border-red-100">

      <img
        src={image || "https://picsum.photos/500"}
        alt={name}
        className="w-full h-72 object-cover"
      />

      <div className="p-6">

        <p className="text-sm text-red-700 font-bold uppercase">
          {category}
        </p>

        <h2 className="text-2xl font-extrabold mt-2">
          {name}
        </h2>

        <p className="text-gray-600 mt-2">
          Material: {material}
        </p>

        <p className="mt-2 font-semibold">

          Stock:{" "}

          <span
            className={
              Number(stock) > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {Number(stock) > 0
              ? `${stock} available`
              : "Out of stock"}
          </span>

        </p>

        <div className="flex flex-wrap gap-2 mt-4">

          {colors.map((color, index) => (

            <span
              key={index}
              className="border border-gray-300 px-3 py-1 rounded-full text-sm"
            >
              {color}
            </span>

          ))}

        </div>

        <div className="flex items-center justify-between mt-8">

          <p className="text-3xl font-extrabold text-red-700">
            ₹{price}
          </p>

          <button
            onClick={addToCart}
            disabled={Number(stock) <= 0}
            className="bg-red-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-800 disabled:bg-gray-400"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}