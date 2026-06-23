import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../card/ProductCard";

export const HeadWearPage = () => {
  const { type } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      if (item.category !== "headwear") return false;

      if (!type) return true;

      return item.type === type;
    });
  }, [products, type]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 pb-16 pt-28 sm:px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">
          Collection
        </p>

        <h1 className="mb-8 text-4xl font-black tracking-tighter sm:text-6xl">
          HEADWEAR
        </h1>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-black">No products found</h2>
            <p className="mt-2 text-neutral-500">
              No headwear products are available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
