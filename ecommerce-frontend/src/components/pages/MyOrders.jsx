import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, XCircle, RefreshCw } from "lucide-react";

const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export default function MyOrders() {
  const user = getUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const getOrders = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/email/${user.email}`,
      );

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setMessage("Could not load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, [user?.email]);

  const cancelOrder = async (id) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/${id}/cancel`,
        { method: "PUT" },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Order cannot be cancelled.");
        return;
      }

      setMessage("Order cancelled successfully.");
      getOrders();
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    }
  };

  const statusStyle = (status = "Pending") => {
    const styles = {
      Delivered: "bg-green-100 text-green-700",
      Paid: "bg-blue-100 text-blue-700",
      Processing: "bg-purple-100 text-purple-700",
      Shipped: "bg-cyan-100 text-cyan-700",
      Cancelled: "bg-red-100 text-red-700",
      Pending: "bg-orange-100 text-orange-700",
    };

    return styles[status] || styles.Pending;
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-4">
        <div className="rounded-4xl border border-black/5 bg-white p-8 text-center sm:p-10">
          <h1 className="mb-4 text-4xl font-black tracking-tighter">
            Please Login
          </h1>

          <p className="mb-8 text-neutral-500">
            You need to login to view your orders.
          </p>

          <Link
            to="/login"
            className="rounded-full bg-black px-8 py-4 text-sm uppercase tracking-widest text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2]">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Loading your orders...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-24 sm:px-6 md:px-14 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 sm:text-sm">
              Account
            </p>

            <h1 className="text-5xl font-black tracking-tighter md:text-6xl">
              My Orders
            </h1>
          </div>

          <button
            onClick={getOrders}
            className="flex w-fit items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm uppercase tracking-widest hover:bg-black hover:text-white"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-black/5 bg-white px-5 py-4 text-sm text-neutral-600">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                cancelOrder={cancelOrder}
                statusStyle={statusStyle}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-4xl border border-black/5 bg-white p-10 text-center sm:p-12">
      <Package size={46} className="mx-auto mb-5 text-neutral-400" />

      <h2 className="mb-3 text-3xl font-black tracking-tighter">
        No Orders Yet
      </h2>

      <p className="mb-8 text-neutral-500">
        Start shopping and your orders will appear here.
      </p>

      <Link
        to="/shop"
        className="rounded-full bg-black px-8 py-4 text-sm uppercase tracking-widest text-white"
      >
        Shop Now
      </Link>
    </div>
  );
}

function OrderCard({ order, cancelOrder, statusStyle }) {
  const status = order.status || "Pending";
  const canCancel = status === "Pending" || status === "Paid";

  return (
    <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-black/5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="text-sm text-neutral-500">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "No date"}
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tighter">
            {order.orderItems?.length || 0} item
            {order.orderItems?.length !== 1 ? "s" : ""} ordered
          </h2>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest ${statusStyle(
            status,
          )}`}
        >
          {status}
        </span>
      </div>

      <div className="p-5 sm:p-6 md:p-8">
        <div className="space-y-4">
          {order.orderItems?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="h-20 w-20 rounded-2xl bg-neutral-100 object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-bold">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  Size: {item.size} · Qty: {item.qty}
                </p>
              </div>

              <p className="font-bold">Rs. {item.price}</p>
            </div>
          ))}
        </div>

        {order.orderItems?.length > 3 && (
          <p className="mt-4 text-sm text-neutral-500">
            + {order.orderItems.length - 3} more item(s)
          </p>
        )}

        <div className="mt-6 flex flex-col gap-5 border-t border-black/5 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-neutral-500">
              Total Amount
            </p>
            <p className="text-2xl font-black">Rs. {order.totalPrice}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={`/track-order/${order._id}`}
              className="flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs uppercase tracking-widest text-white hover:bg-neutral-800"
            >
              <Truck size={16} />
              Track Order
            </Link>

            {canCancel && (
              <button
                onClick={() => cancelOrder(order._id)}
                className="flex items-center justify-center gap-2 rounded-full border border-red-200 px-6 py-3 text-xs uppercase tracking-widest text-red-600 hover:bg-red-600 hover:text-white"
              >
                <XCircle size={16} />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
