import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductCard } from "../card/ProductCard";
import { useToast } from "../../ui/Toast";

export default function ProductDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((item) => item._id === id);

        setProducts(list);
        setProduct(found || null);
        setSelectedSize(found?.sizes?.[0] || "M");
      } catch (error) {
        console.log(error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      (item) => item._id === product._id && item.size === selectedSize,
    );

    if (existing) existing.qty += qty;
    else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast({ type: "success", message: `${product.name} added to cart` });
  };

  const addToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.some((item) => item._id === product._id)) {
      showToast({
        type: "info",
        message: `${product.name} is already in wishlist`,
      });
      return;
    }

    localStorage.setItem("wishlist", JSON.stringify([...wishlist, product]));
    window.dispatchEvent(new Event("wishlistUpdated"));
    showToast({
      type: "success",
      message: `${product.name} added to wishlist`,
    });
  };

  if (loading) return <ProductSkeleton />;

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 pt-24">
        <p className="text-lg font-semibold">Product not found</p>
      </main>
    );
  }

  const similarProducts = products
    .filter(
      (item) => item.category === product.category && item._id !== product._id,
    )
    .slice(0, 4);

  return (
    <main className="px-4 pb-16 pt-24 sm:px-6 md:px-10 lg:px-14">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
        <div className="overflow-hidden rounded-3xl bg-neutral-200">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-75 w-full object-cover sm:h-105 lg:h-137.5"
          />
        </div>

        <div className="h-fit lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
            {product.category}
          </p>

          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl">
            {product.name}
          </h1>

          <p className="mt-5 text-xl font-semibold">Rs. {product.price}</p>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
            {product.description ||
              "Premium streetwear essential designed for everyday wear with a clean modern silhouette."}
          </p>

          <div className="mt-6">
            <h3 className="mb-3 text-xs uppercase tracking-widest">Size</h3>

            <div className="flex flex-wrap gap-3">
              {(product.sizes || ["M"]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-5 py-2.5 text-sm transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-black/20 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-xs uppercase tracking-widest">Quantity</h3>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="h-10 w-10 rounded-full border border-black/20"
              >
                -
              </button>

              <span className="min-w-6 text-center font-semibold">{qty}</span>

              <button
                onClick={() => setQty(qty + 1)}
                className="h-10 w-10 rounded-full border border-black/20"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={addToCart}
              className="flex flex-1 items-center justify-center gap-3 rounded-full bg-black py-4 text-xs uppercase tracking-widest text-white hover:bg-neutral-800"
            >
              <ShoppingBag size={17} />
              Add To Cart
            </button>

            <button
              onClick={addToWishlist}
              className="flex w-14 items-center justify-center rounded-full border border-black/20 hover:bg-black hover:text-white"
            >
              <Heart size={19} />
            </button>
          </div>
        </div>
      </section>

      {similarProducts.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="mb-6 text-3xl font-black tracking-tighter">
            Similar Products
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {similarProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function ProductSkeleton() {
  return (
    <main className="px-4 pb-16 pt-24 sm:px-6 md:px-10 lg:px-14">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
        <Skeleton height={560} borderRadius={24} />

        <div>
          <Skeleton width={150} height={16} />
          <Skeleton height={55} className="mt-4" />
          <Skeleton width={130} height={26} className="mt-5" />
          <Skeleton count={3} className="mt-5" />
          <Skeleton height={52} className="mt-8" />
        </div>
      </section>
    </main>
  );
}
