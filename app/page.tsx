import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white overflow-hidden">
        <section className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 blur-3xl rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

          <div className="relative z-10">
            <p className="inline-block bg-white/10 border border-white/20 px-5 py-2 rounded-full text-sm tracking-[3px] uppercase text-gray-300 mb-6">
              Premium Online Store
            </p>

            <h1 className="text-6xl lg:text-7xl font-extrabold leading-tight">
              Shop Smart.
              <br />
              Live Better.
            </h1>

            <p className="mt-8 text-xl text-gray-300 leading-relaxed max-w-xl">
              Explore premium products with a clean shopping experience,
              fast checkout, downloadable invoice and reliable delivery support.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <a
                href="/products"
                className="bg-yellow-400 text-black px-9 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 transition shadow-xl"
              >
                Explore Products
              </a>

              <a
                href="/cart"
                className="border border-white/40 px-9 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition"
              >
                View Cart
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-16 max-w-xl">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                <h2 className="text-3xl font-bold text-yellow-400">
                  100+
                </h2>
                <p className="text-gray-400 mt-2">
                  Products
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                <h2 className="text-3xl font-bold text-yellow-400">
                  Free
                </h2>
                <p className="text-gray-400 mt-2">
                  Invoice
                </p>
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
                <h2 className="text-3xl font-bold text-yellow-400">
                  Fast
                </h2>
                <p className="text-gray-400 mt-2">
                  Delivery
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="bg-white/10 border border-white/10 rounded-[2rem] p-5 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200"
                alt="Featured product"
                className="rounded-[1.5rem] w-full h-[520px] object-cover"
              />

              <div className="bg-white text-black rounded-3xl p-6 -mt-20 mx-6 relative shadow-2xl">
                <p className="text-gray-500">
                  Featured Collection
                </p>

                <h2 className="text-3xl font-extrabold mt-1">
                  Premium Lifestyle Products
                </h2>

                <div className="flex justify-between items-center mt-5">
                  <span className="font-bold text-xl">
                    Starting ₹999
                  </span>

                  <a
                    href="/products"
                    className="bg-black text-white px-5 py-3 rounded-full font-semibold"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>
    </>
  );
}