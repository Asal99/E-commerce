import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function TrackOrder() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/orders/${id}`,
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Order not found");
          return;
        }

        setOrder(data);
      } catch (error) {
        console.log(error);
        setError("Something went wrong while loading your order.");
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id]);

  const getStatus = () => {
    if (order?.status) return order.status;
    if (order?.isDelivered) return "Delivered";
    if (order?.isPaid) return "Paid";
    return "Processing";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-4">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          Loading order status...
        </p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-4">
        <div className="max-w-md rounded-4xl border border-black/5 bg-white p-8 text-center sm:p-10">
          <h1 className="mb-4 text-4xl font-black tracking-tighter">
            Order Not Found
          </h1>

          <p className="mb-8 text-neutral-500">
            We could not find this order. Please check your order status from
            your profile.
          </p>

          <Link
            to="/profile"
            className="rounded-full bg-black px-8 py-4 text-sm uppercase tracking-widest text-white"
          >
            Go To Profile
          </Link>
        </div>
      </main>
    );
  }

  const status = getStatus();

  return (
    <main className="min-h-screen bg-[#f7f7f2] px-4 py-24 sm:px-6 md:py-28">
      <div className="mx-auto max-w-3xl rounded-4xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 md:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500 sm:text-sm">
          Order Tracking
        </p>

        <h1 className="mb-8 text-4xl font-black tracking-tighter md:text-5xl">
          Your Order Status
        </h1>

        <div className="mb-8 rounded-3xl bg-neutral-100 p-5 sm:p-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
            Current Status
          </p>

          <p className="text-3xl font-black tracking-tighter">{status}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Progress
              active={["Processing", "Paid", "Delivered"].includes(status)}
            />
            <Progress active={["Paid", "Delivered"].includes(status)} />
            <Progress active={status === "Delivered"} />
          </div>

          <div className="mt-3 grid grid-cols-3 text-[10px] uppercase tracking-widest text-neutral-500 sm:text-xs">
            <p>Processing</p>
            <p className="text-center">Paid</p>
            <p className="text-right">Delivered</p>
          </div>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <InfoBox title="Customer">
            <p className="font-semibold">{order.customerName}</p>
            <p className="mt-1 text-sm text-neutral-500">{order.email}</p>
          </InfoBox>

          <InfoBox title="Delivery Address">
            <p className="font-semibold">
              {order.shippingAddress?.city || "No city"}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {order.shippingAddress?.address || "No address"}
            </p>
          </InfoBox>
        </div>

        <h2 className="mb-4 text-2xl font-black tracking-tighter">
          Items Ordered
        </h2>

        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-3xl border border-black/5 p-4"
            >
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

        <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-6">
          <p className="text-sm uppercase tracking-widest text-neutral-500">
            Total
          </p>

          <p className="text-2xl font-black">Rs. {order.totalPrice}</p>
        </div>
      </div>
    </main>
  );
}

function Progress({ active }) {
  return (
    <div
      className={`h-2 rounded-full ${active ? "bg-black" : "bg-neutral-300"}`}
    />
  );
}

function InfoBox({ title, children }) {
  return (
    <div className="rounded-3xl bg-neutral-50 p-5">
      <p className="mb-2 text-xs uppercase tracking-widest text-neutral-500">
        {title}
      </p>
      {children}
    </div>
  );
}
