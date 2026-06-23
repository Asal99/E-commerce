import { useEffect, useState } from "react";
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../ui/Toast";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id, size, name) => {
    saveCart(cart.filter((item) => !(item._id === id && item.size === size)));
    showToast({ type: "info", message: `${name} removed from cart` });
  };

  const updateQty = (id, size, qty) => {
    if (qty < 1) return;

    saveCart(
      cart.map((item) =>
        item._id === id && item.size === size ? { ...item, qty } : item,
      ),
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0,
  );

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 pb-14 pt-24 sm:px-6 md:px-10 lg:px-14">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">
            Your Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-5">
              {cart.map((item) => (
                <CartItem
                  key={`${item._id}-${item.size}`}
                  item={item}
                  updateQty={updateQty}
                  removeItem={removeItem}
                />
              ))}
            </div>

            <aside className="h-fit rounded-4xl bg-black p-6 text-white shadow-2xl lg:sticky lg:top-24 md:p-7">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/40">
                Checkout
              </p>

              <h2 className="mb-6 text-3xl font-black tracking-tighter">
                Summary
              </h2>

              <SummaryRow label="Subtotal" value={`Rs. ${subtotal}`} />
              <SummaryRow label="Delivery" value="Free" />
              <SummaryRow label="Items" value={cart.length} />

              <div className="flex justify-between pt-5 text-xl font-black">
                <span>Total</span>
                <span>Rs. {subtotal}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 text-xs uppercase tracking-widest text-black hover:bg-neutral-200"
              >
                Checkout <ArrowRight size={16} />
              </Link>

              <Link
                to="/shop"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-white/15 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black"
              >
                Add More Items
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function CartItem({ item, updateQty, removeItem }) {
  return (
    <div className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-5">
      <div className="grid grid-cols-[95px_1fr] gap-4 md:grid-cols-[130px_1fr_auto] md:gap-6">
        <div className="overflow-hidden rounded-2xl bg-neutral-100">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="h-32 w-full object-cover transition duration-500 hover:scale-105 md:h-40"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="line-clamp-2 text-lg font-black tracking-tighter md:text-2xl">
              {item.name}
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Size {item.size}</Badge>
              <Badge>Rs. {item.price}</Badge>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <QtyButton
              onClick={() => updateQty(item._id, item.size, item.qty - 1)}
            >
              <Minus size={15} />
            </QtyButton>

            <span className="min-w-7 text-center font-semibold">
              {item.qty}
            </span>

            <QtyButton
              onClick={() => updateQty(item._id, item.size, item.qty + 1)}
            >
              <Plus size={15} />
            </QtyButton>
          </div>
        </div>

        <div className="col-span-2 flex items-center justify-between gap-5 md:col-span-1 md:flex-col md:items-end">
          <p className="text-lg font-black md:text-xl">
            Rs. {item.price * (item.qty || 1)}
          </p>

          <button
            onClick={() => removeItem(item._id, item.size, item.name)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-neutral-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-4xl border border-black/5 bg-white px-6 py-12 text-center shadow-sm sm:px-10 md:px-16 md:py-14">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white md:h-20 md:w-20">
        <ShoppingBag size={32} />
      </div>

      <h2 className="mb-3 text-2xl font-black tracking-tighter md:text-3xl">
        Your cart is empty
      </h2>

      <p className="mx-auto mb-7 max-w-md text-sm text-neutral-500 md:text-base">
        Looks like you have not added anything to your cart yet.
      </p>

      <Link
        to="/shop"
        className="inline-flex items-center gap-3 rounded-full bg-black px-7 py-3.5 text-xs uppercase tracking-widest text-white hover:bg-neutral-800"
      >
        Shop Now <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-white/10 py-4">
      <span className="text-white/50">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function QtyButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 hover:bg-black hover:text-white"
    >
      {children}
    </button>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600">
      {children}
    </span>
  );
}
