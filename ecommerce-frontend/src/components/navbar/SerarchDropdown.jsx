import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function SearchDropdown({ scrolled }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef(null);
  const isHome = useLocation().pathname === "/";

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.log);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!searchRef.current?.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const clearSearch = () => {
    setSearch("");
    setOpen(false);
  };

  const filteredProducts = products
    .filter((item) => {
      const keyword = search.toLowerCase();
      return ["name", "category", "type", "tag"].some((key) =>
        item[key]?.toLowerCase().includes(keyword),
      );
    })
    .slice(0, 6);

  const darkStyle = isHome || scrolled;

  return (
    <div ref={searchRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search
          size={17}
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${
            darkStyle ? "text-white/70" : "text-neutral-400"
          }`}
        />

        <input
          value={search}
          type="text"
          placeholder="Search products..."
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          className={`w-full rounded-full py-3 pl-11 pr-10 text-sm outline-none transition ${
            darkStyle
              ? "border border-white/20 bg-black/35 text-white placeholder:text-white/60 focus:border-white/50"
              : "border border-black/10 bg-white text-black placeholder:text-neutral-400 focus:border-black"
          }`}
        />

        {search && (
          <button
            onClick={clearSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              darkStyle ? "text-white/70" : "text-neutral-400"
            }`}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && search && (
        <div className="absolute left-0 top-14 z-50 w-full overflow-hidden rounded-3xl border border-black/10 bg-[#f7f7f2] shadow-2xl">
          {filteredProducts.length === 0 ? (
            <p className="p-5 text-sm text-neutral-500">No products found</p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {filteredProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  onClick={clearSearch}
                  className="flex items-center gap-4 p-4 transition hover:bg-white"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-2xl bg-neutral-200 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-black">
                      {item.name}
                    </h3>

                    <p className="mt-1 truncate text-xs capitalize text-neutral-500">
                      {item.category} · {item.type}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-black">
                    Rs. {item.price}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <Link
            to="/shop"
            onClick={clearSearch}
            className="block border-t border-black/10 py-4 text-center text-xs uppercase tracking-widest text-neutral-500 hover:bg-white hover:text-black"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
}
