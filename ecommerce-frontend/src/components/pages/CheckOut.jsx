import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const getLocalStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value && value !== "undefined" ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export default function CheckOut() {
  const navigate = useNavigate();
  const user = getLocalStorage("user", null);
  const cart = getLocalStorage("cart", []);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: user?.name || user?.fullName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty || 1),
    0,
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    if (!cart.length) return navigate("/cart");

    if (!form.customerName || !form.email || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    const orderData = {
      user: user?._id || null,
      isGuest: !user,
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      orderItems: cart.map((item) => ({
        name: item.name,
        qty: item.qty || 1,
        image: item.image,
        price: item.price,
        size: item.size,
        product: item._id,
      })),
      shippingAddress: {
        address: form.address,
        city: form.city,
        phone: form.phone,
      },
      totalPrice,
    };

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate(`/order-success/${data._id}`);
    } catch {
      alert("Server error. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f1ec] px-4 pb-20 pt-28 sm:px-6 md:px-14 md:pt-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Checkout
          </p>

          <h1 className="mb-8 mt-2 text-5xl font-black tracking-tighter md:text-7xl">
            Complete Order
          </h1>

          <div className="rounded-3xl bg-white p-5 shadow-sm md:p-8">
            <div
              className={`mb-6 rounded-2xl p-4 text-sm ${
                user
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {user
                ? `Logged in as ${user.email}`
                : "You are ordering as a guest."}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["customerName", "Full Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["city", "City"],
              ].map(([name, placeholder]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-4 outline-none focus:border-black"
                />
              ))}

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full Address"
                className="w-full rounded-2xl border border-neutral-300 px-4 py-4 outline-none focus:border-black md:col-span-2"
              />
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl bg-black p-6 text-white md:p-7 lg:sticky lg:top-28">
          <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

          {!cart.length ? (
            <>
              <p className="text-white/60">Your cart is empty.</p>

              <Link
                to="/shop"
                className="mt-6 block rounded-xl bg-white py-4 text-center text-sm uppercase tracking-widest text-black"
              >
                Shop Now
              </Link>
            </>
          ) : (
            <>
              <div className="max-h-80 space-y-4 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={`${item._id}-${item.size}`}
                    className="flex gap-4 border-b border-white/10 pb-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-20 w-16 rounded-xl bg-white/10 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-semibold">{item.name}</p>
                      <p className="text-sm text-white/50">
                        Size {item.size} · Qty {item.qty || 1}
                      </p>
                      <p className="mt-1 text-sm">Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <SummaryRow label="Subtotal" value={`Rs. ${totalPrice}`} />
              <SummaryRow label="Delivery" value="Free" />

              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>Rs. {totalPrice}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-white py-4 text-sm font-bold uppercase tracking-widest text-black disabled:opacity-60"
              >
                {loading ? "Placing..." : "Place Order"}
              </button>
            </>
          )}
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="mt-5 flex justify-between border-t border-white/10 pt-5">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
