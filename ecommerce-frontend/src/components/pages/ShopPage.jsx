import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductCard } from "../card/ProductCard";

const fetchProducts = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilter, setShowFilter] = useState(false);

  const [tempMaxPrice, setTempMaxPrice] = useState(100000);
  const [maxPrice, setMaxPrice] = useState(100000);

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  const products = Array.isArray(data) ? data : [];

  const categories = [
    ["All", "all"],
    ["Eyewear", "eyewear"],
    ["Headwear", "headwear"],
    ["Clothing", "apparel"],
    ["Accessories", "accessories"],
  ];

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    let result = products.filter((item) => {
      const price = Number(item.price) || 0;

      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;

      const matchSearch = [item.name, item.category, item.type, item.tag].some(
        (value) => value?.toLowerCase().includes(keyword),
      );

      const matchPrice = price <= maxPrice;

      return matchCategory && matchSearch && matchPrice;
    });

    if (sortBy === "low-high") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "high-low") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "a-z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "z-a") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, activeCategory, search, sortBy, maxPrice]);

  const resetFilter = () => {
    setTempMaxPrice(100000);
    setMaxPrice(100000);
    setShowFilter(false);
  };

  const applyFilter = () => {
    setMaxPrice(tempMaxPrice);
    setShowFilter(false);
  };

  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 pb-20 pt-28 sm:px-6 md:px-14 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 sm:text-sm">
            Collection
          </p>

          <h1 className="text-5xl font-black tracking-tighter md:text-7xl">
            Shop All
          </h1>
        </div>

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="text"
              placeholder="Search streetwear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-4 pl-12 pr-5 outline-none transition focus:border-black"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex h-11 items-center gap-2 bg-transparent text-sm font-bold uppercase tracking-widest"
              >
                <SlidersHorizontal size={17} />
                Filter
              </button>

              {showFilter && (
                <div className="absolute right-0 top-12 z-50 w-75 rounded-xl border border-black/10 bg-white p-5 shadow-xl">
                  <h3 className="mb-5 text-sm font-black uppercase tracking-widest">
                    Price Range
                  </h3>

                  <div className="mb-3 flex justify-between text-sm text-neutral-500">
                    <span>NPR 0</span>
                    <span>NPR {tempMaxPrice.toLocaleString()}</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(Number(e.target.value))}
                    className="w-full accent-black"
                  />

                  <div className="mt-1 flex justify-between text-sm text-neutral-400">
                    <span>0</span>
                    <span>50k</span>
                    <span>100k</span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      onClick={resetFilter}
                      className="border border-black px-4 py-3 text-xs font-black uppercase tracking-widest"
                    >
                      Reset
                    </button>

                    <button
                      onClick={applyFilter}
                      className="bg-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-14 border border-black bg-transparent px-5 text-sm font-bold uppercase tracking-widest outline-none"
            >
              <option value="default">Sort</option>
              <option value="low-high">Price ↑</option>
              <option value="high-low">Price ↓</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map(([label, value]) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={`rounded-full border px-5 py-3 text-xs uppercase tracking-widest transition ${
                activeCategory === value
                  ? "border-black bg-black text-white"
                  : "border-black/10 bg-white hover:border-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : isError ? (
          <EmptyMessage title="Failed to load products" error />
        ) : filtered.length === 0 ? (
          <EmptyMessage
            title="No products found"
            text="Try adjusting your filters."
          />
        ) : (
          <>
            <p className="mb-8 font-bold uppercase tracking-widest text-neutral-800">
              {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => (
                <ProductCard key={item._id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <Skeleton height={360} borderRadius={24} />
          <Skeleton height={18} className="mt-4" />
          <Skeleton width="60%" height={18} />
        </div>
      ))}
    </div>
  );
}

function EmptyMessage({ title, text, error }) {
  return (
    <div className="rounded-4xl border border-black/5 bg-white p-10 text-center sm:p-12">
      <h2
        className={`mb-3 text-3xl font-black tracking-tighter ${
          error ? "text-red-500" : ""
        }`}
      >
        {title}
      </h2>

      {text && <p className="text-neutral-500">{text}</p>}
    </div>
  );
}
