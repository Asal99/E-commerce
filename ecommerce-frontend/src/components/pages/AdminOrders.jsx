import { useEffect, useState } from "react";
import { Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

const API = `${import.meta.env.VITE_API_URL}/api/orders`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [openOrder, setOpenOrder] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      getOrders();
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingId("");
    }
  };

  const getStatus = (order) => order.status || "Pending";

  const statusStyle = (status) => {
    const styles = {
      Delivered: "text-green-300 border-green-400/20 bg-green-400/10",
      Paid: "text-blue-300 border-blue-400/20 bg-blue-400/10",
      Processing: "text-purple-300 border-purple-400/20 bg-purple-400/10",
      Shipped: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
      Cancelled: "text-red-300 border-red-400/20 bg-red-400/10",
      Pending: "text-orange-300 border-orange-400/20 bg-orange-400/10",
    };

    return styles[status] || styles.Pending;
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();
    const status = getStatus(order).toLowerCase();

    return (
      order._id?.toLowerCase().includes(keyword) ||
      order.customerName?.toLowerCase().includes(keyword) ||
      order.email?.toLowerCase().includes(keyword) ||
      status.includes(keyword)
    );
  });

  return (
    <main className="text-white">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">
            Store Management
          </p>
          <h1 className="text-3xl font-black tracking-tighter sm:text-5xl">
            Orders
          </h1>
        </div>

        <button
          onClick={getOrders}
          className="flex w-fit items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm transition hover:bg-white hover:text-black"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="relative mb-6">
        <Search
          size={17}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40"
        />

        <input
          type="text"
          placeholder="Search order, customer, email or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-[#151515] py-4 pl-12 pr-5 text-white outline-none placeholder:text-white/35 focus:border-white/40"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isOpen = openOrder === order._id;
          const status = getStatus(order);

          return (
            <div
              key={order._id}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111]"
            >
              <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_auto] lg:items-center">
                <Info
                  title="Order"
                  value={`#${order._id.slice(-6).toUpperCase()}`}
                />

                <div>
                  <Label>Customer</Label>
                  <p className="mt-1 font-semibold">
                    {order.customerName || "Customer"}
                  </p>
                  <p className="mt-1 text-xs text-white/40">{order.email}</p>
                </div>

                <div>
                  <Label>Location</Label>
                  <p className="mt-1 font-semibold">
                    {order.shippingAddress?.city || "No city"}
                  </p>
                  <p className="mt-1 max-w-40 truncate text-xs text-white/40">
                    {order.shippingAddress?.address || "No address"}
                  </p>
                </div>

                <Info title="Total" value={`Rs. ${order.totalPrice}`} />

                <div>
                  <Label>Status</Label>
                  <span
                    className={`mt-2 inline-block rounded-full border px-3 py-1 text-xs ${statusStyle(
                      status,
                    )}`}
                  >
                    {status}
                  </span>
                </div>

                <button
                  onClick={() => setOpenOrder(isOpen ? "" : order._id)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:bg-white hover:text-black"
                >
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-white/10 bg-black/30 p-5">
                  <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <div>
                      <h3 className="mb-4 text-lg font-bold">Products</h3>

                      <div className="space-y-3">
                        {order.orderItems?.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 rounded-2xl bg-white/5 p-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-16 w-16 rounded-xl bg-white/10 object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 font-semibold">
                                {item.name}
                              </p>
                              <p className="text-sm text-white/40">
                                Size: {item.size} · Qty: {item.qty}
                              </p>
                            </div>

                            <p className="font-bold">Rs. {item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-4 text-lg font-bold">Manage Order</h3>

                      <div className="space-y-5 rounded-2xl bg-white/5 p-5">
                        <div>
                          <Label>Order Status</Label>

                          <select
                            value={status}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              updateStatus(order._id, e.target.value)
                            }
                            className="mt-3 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-white outline-none focus:border-white/40"
                          >
                            {[
                              "Pending",
                              "Paid",
                              "Processing",
                              "Shipped",
                              "Delivered",
                              "Cancelled",
                            ].map((item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            ))}
                          </select>

                          {updatingId === order._id && (
                            <p className="mt-2 text-xs text-white/40">
                              Updating status...
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <MiniBox
                            title="Payment"
                            value={order.isPaid ? "Paid" : "Unpaid"}
                          />
                          <MiniBox
                            title="Delivery"
                            value={order.isDelivered ? "Delivered" : "Not Yet"}
                          />
                        </div>

                        <div className="border-t border-white/10 pt-4 text-sm text-white/40">
                          <p>
                            Date:{" "}
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "No date"}
                          </p>

                          <p className="mt-2">
                            Phone:{" "}
                            {order.shippingAddress?.phone ||
                              order.phone ||
                              "No phone"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="rounded-[28px] border border-white/10 bg-[#111] p-12 text-center text-white/40">
            No orders found.
          </div>
        )}
      </div>
    </main>
  );
}

function Label({ children }) {
  return (
    <p className="text-xs uppercase tracking-widest text-white/40">
      {children}
    </p>
  );
}

function Info({ title, value }) {
  return (
    <div>
      <Label>{title}</Label>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function MiniBox({ title, value }) {
  return (
    <div className="rounded-xl bg-black/30 p-4">
      <Label>{title}</Label>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}
