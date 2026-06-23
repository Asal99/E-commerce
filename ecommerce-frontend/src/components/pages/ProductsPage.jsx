import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
  const [activeType, setActiveType] = useState("all");
  const [activeTag, setActiveTag] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");

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

  const types = [
    ["All", "all"],
    ["Sunglasses", "sunglasses"],
    ["Blue Light", "bluelight"],
    ["Dad Cap", "dad"],
    ["Baseball", "baseball"],
    ["Hoodie", "hoodie"],
    ["T-Shirt", "tshirt"],
  ];

  const tags = [
    ["All", "all"],
    ["New", "new"],
    ["Bestseller", "bestseller"],
  ];

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    let result = products.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;

      const matchType = activeType === "all" || item.type === activeType;

      const matchTag = activeTag === "all" || item.tag === activeTag;

      const matchSearch = [item.name, item.category, item.type, item.tag].some(
        (value) => value?.toLowerCase().includes(keyword),
      );

      return matchCategory && matchType && matchTag && matchSearch;
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
  }, [products, activeCategory, activeType, activeTag, search, sortBy]);

  const resetFilters = () => {
    setActiveCategory("all");
    setActiveType("all");
    setActiveTag("all");
    setSortBy("default");
    setSearch("");
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

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-xs uppercase tracking-widest transition hover:border-black"
              >
                <SlidersHorizontal size={15} />
                Filter
              </button>

              {showFilters && (
                <div className="absolute right-0 top-14 z-50 w-[320px] rounded-3xl border border-black/5 bg-white p-4 shadow-2xl sm:w-90">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest">
                      Filters
                    </h3>

                    <button onClick={() => setShowFilters(false)}>
                      <X size={18} />
                    </button>
                  </div>

                  <FilterGroup
                    title="Category"
                    items={categories}
                    active={activeCategory}
                    setActive={setActiveCategory}
                  />

                  <FilterGroup
                    title="Type"
                    items={types}
                    active={activeType}
                    setActive={setActiveType}
                  />

                  <FilterGroup
                    title="Tag"
                    items={tags}
                    active={activeTag}
                    setActive={setActiveTag}
                  />

                  <button
                    onClick={resetFilters}
                    className="mt-2 w-full rounded-full border border-black/10 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 rounded-full border border-black/10 bg-white px-4 text-xs uppercase tracking-widest outline-none transition hover:border-black"
            >
              <option value="default">Sort</option>
              <option value="low-high">Price ↑</option>
              <option value="high-low">Price ↓</option>
              <option value="a-z">A-Z</option>
              <option value="z-a">Z-A</option>
            </select>
          </div>
        </div>

        {loading ? (
          <ProductSkeleton />
        ) : isError ? (
          <EmptyMessage title="Failed to load products" error />
        ) : filtered.length === 0 ? (
          <EmptyMessage
            title="No products found"
            text="Try adjusting your filters or search keyword."
          />
        ) : (
          <>
            <p className="mb-8 text-neutral-500">
              Showing {filtered.length} product
              {filtered.length !== 1 ? "s" : ""}
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

function FilterGroup({ title, items, active, setActive }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-500">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map(([label, value]) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-widest ${
              active === value
                ? "border-black bg-black text-white"
                : "border-black/10 bg-[#f7f7f2] hover:border-black"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
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
