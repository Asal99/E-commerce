import { useEffect, useState } from "react";
import { Hero } from "../home/Hero";
import { ProductCard } from "../card/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Hero />

      <section className="px-6 md:px-14 py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-neutral-500">
              Curated Drop
            </p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              New Arrivals
            </h2>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {products.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
