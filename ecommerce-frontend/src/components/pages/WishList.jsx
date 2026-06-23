import { useEffect, useState } from "react";
import { Trash2, Heart } from "lucide-react";
import { ProductCard } from "../card/ProductCard";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, []);

  const removeItem = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 pb-16 pt-24 sm:px-6 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 md:mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-neutral-500">
            Saved Items
          </p>

          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
            Wishlist
          </h1>

          {wishlist.length > 0 && (
            <p className="mt-3 text-sm text-neutral-500">
              {wishlist.length} saved product{wishlist.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-4xl border border-black/5 bg-white p-8 text-center shadow-sm sm:p-10 md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white sm:h-20 sm:w-20">
              <Heart size={30} />
            </div>

            <h2 className="mb-3 text-2xl font-black tracking-tighter sm:text-3xl">
              No saved products yet
            </h2>

            <p className="mx-auto max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
              Save your favourite streetwear products and view them here later.
            </p>

            <Link
              to="/shop"
              className="mt-7 inline-block rounded-full bg-black px-7 py-3.5 text-xs uppercase tracking-widest text-white hover:bg-neutral-800"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((item) => (
              <div key={item._id} className="relative">
                <ProductCard item={item} />

                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute left-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-sm transition hover:bg-red-500 hover:text-white sm:left-3 sm:top-3 sm:h-10 sm:w-10"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
