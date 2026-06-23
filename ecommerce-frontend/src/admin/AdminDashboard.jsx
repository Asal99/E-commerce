import { useEffect, useMemo, useState } from "react";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsRes, ordersRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/orders`),
        ]);

        if (!productsRes.ok) throw new Error("Failed to fetch products");
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");

        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const totalUsers = useMemo(() => {
    const emails = orders.map((order) => order.email).filter(Boolean);
    return new Set(emails).size;
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (order.status === "Cancelled") return sum;
      return sum + Number(order.totalPrice || 0);
    }, 0);
  }, [orders]);

  const stats = [
    {
      title: "Products",
      value: products.length,
      icon: Package,
    },
    {
      title: "Orders",
      value: orders.length,
      icon: ShoppingBag,
    },
    {
      title: "Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Revenue",
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <main className="w-full">
      <div className="mb-8 sm:mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-white/40 sm:text-sm sm:tracking-[0.3em]">
          Admin Panel
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-5xl">
          Dashboard
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 sm:p-6"
            >
              <Icon className="mb-5 text-white/50" size={26} />

              <p className="text-xs uppercase tracking-widest text-white/40 sm:text-sm">
                {item.title}
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                {loading ? "..." : item.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold sm:text-2xl">Recent Products</h2>

          <p className="text-sm text-white/40">
            Showing latest {Math.min(products.length, 8)} products
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-white/10"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
            <p className="font-bold">No products found</p>
            <p className="mt-2 text-sm text-white/40">
              Products will appear here after they are added.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 uppercase tracking-widest text-white/40">
                  <tr>
                    <th className="py-4 pr-4">Product</th>
                    <th className="py-4 pr-4">Category</th>
                    <th className="py-4 pr-4">Price</th>
                    <th className="py-4">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {products.slice(0, 8).map((item) => (
                    <tr key={item._id} className="border-b border-white/5">
                      <td className="flex items-center gap-3 py-4 pr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-14 w-12 rounded-lg object-cover"
                        />
                        <span className="line-clamp-1 font-medium">
                          {item.name}
                        </span>
                      </td>

                      <td className="py-4 pr-4 text-white/60">
                        {item.category || "N/A"}
                      </td>

                      <td className="py-4 pr-4 font-semibold">
                        Rs. {item.price}
                      </td>

                      <td className="py-4">{item.stock ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {products.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-20 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-bold">{item.name}</h3>

                      <p className="mt-1 text-sm text-white/50">
                        {item.category || "N/A"}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="font-bold">Rs. {item.price}</span>
                        <span className="text-white/50">
                          Stock: {item.stock ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
