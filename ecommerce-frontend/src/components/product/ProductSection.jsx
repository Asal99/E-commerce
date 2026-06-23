import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductCard } from "../card/ProductCard";

const fetchProducts = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const ProductSection = () => {
  const [activeTag, setActiveTag] = useState("");
  const [activeType, setActiveType] = useState("");

  const navigate = useNavigate();

  const {
    data: products,
    isPending,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filteredProducts = (products || []).filter((item) => {
    const matchTag =
      activeTag === "" ? true : item.tag?.toLowerCase() === activeTag;

    const matchType =
      activeType === ""
        ? true
        : activeType === "headwear"
          ? [
              "cap",
              "beanie",
              "bucket-hat",
              "dad",
              "baseball",
              "snapback",
            ].includes(item.type?.toLowerCase())
          : activeType === "eyewear"
            ? ["sunglasses", "bluelight", "optical-glasses"].includes(
                item.type?.toLowerCase(),
              )
            : item.type?.toLowerCase() === activeType;

    return matchTag && matchType;
  });

  if (isPending || isLoading || isFetching || !products) {
    return (
      <section className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <Skeleton height={320} borderRadius={12} />
              <Skeleton height={18} className="mt-4" />
              <Skeleton width="60%" height={18} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="p-10 text-center">
        <p className="text-red-500">Failed to load products.</p>
      </section>
    );
  }

  return (
    <section className="p-6">
      <div className="flex gap-3 mb-4 justify-center flex-wrap">
        {[
          { label: "NEW ARRIVALS", value: "new" },
          { label: "BESTSELLER", value: "bestseller" },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() =>
              setActiveTag(activeTag === btn.value ? "" : btn.value)
            }
            className={`px-4 py-2 rounded-full border text-xs uppercase tracking-wide transition ${
              activeTag === btn.value
                ? "bg-black text-white"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6 justify-center flex-wrap">
        {[
          { label: "ALL", value: "" },
          { label: "HATS & CAPS", value: "headwear" },
          { label: "T-SHIRTS", value: "tshirt" },
          { label: "EYEWEAR", value: "eyewear" },
          { label: "BOTTOMS", value: "pant" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => {
              if (btn.value === "") {
                setActiveType("");
                setActiveTag("");
              } else {
                setActiveType(activeType === btn.value ? "" : btn.value);
              }
            }}
            className={`px-4 py-2 rounded-full border text-xs uppercase tracking-wide transition ${
              btn.value !== "" && activeType === btn.value
                ? "bg-black text-white"
                : "bg-white hover:bg-black hover:text-white"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm uppercase tracking-wide text-neutral-500">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/NewArrivals")}
          className="bg-black text-white px-6 py-3 rounded-lg text-sm tracking-wide hover:opacity-90 transition"
        >
          VIEW ALL
        </button>
      </div>
    </section>
  );
};
