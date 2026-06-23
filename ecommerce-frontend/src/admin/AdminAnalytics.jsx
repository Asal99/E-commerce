import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminAnalytics() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [productRes, orderRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/orders`),
        ]);

        const productData = await productRes.json();
        const orderData = await orderRes.json();

        setProducts(Array.isArray(productData) ? productData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "Cancelled");

    const revenue = validOrders.reduce(
      (sum, order) => sum + Number(order.totalPrice || 0),
      0,
    );

    const customers = new Set(orders.map((o) => o.email).filter(Boolean)).size;

    const categoryData = Object.entries(
      products.reduce((acc, item) => {
        const key = item.category || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    ).map(([name, value]) => ({ name, value }));

    const statusData = Object.entries(
      orders.reduce((acc, item) => {
        const key = item.status || "Pending";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {}),
    ).map(([name, value]) => ({ name, value }));

    const revenueData = orders.slice(-8).map((order, index) => ({
      name: `Order ${index + 1}`,
      revenue: Number(order.totalPrice || 0),
    }));

    return {
      revenue,
      customers,
      totalOrders: orders.length,
      totalProducts: products.length,
      categoryData,
      statusData,
      revenueData,
      recentOrders: orders.slice(-5).reverse(),
    };
  }, [products, orders]);

  if (loading) {
    return <p className="text-white/50">Loading analytics...</p>;
  }

  return (
    <main className="text-white">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            Store Insights
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Analytics Dashboard
          </h1>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={DollarSign}
          title="Revenue"
          value={`Rs. ${analytics.revenue.toLocaleString()}`}
        />
        <Stat icon={ShoppingBag} title="Orders" value={analytics.totalOrders} />
        <Stat icon={Users} title="Customers" value={analytics.customers} />
        <Stat icon={Package} title="Products" value={analytics.totalProducts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Revenue Movement" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.revenueData}>
              <XAxis dataKey="name" stroke="#777" fontSize={12} />
              <YAxis stroke="#777" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ffffff"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Order Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
              >
                {analytics.statusData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#ffffff", "#888888", "#555555", "#333333", "#bbbbbb"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <ChartCard title="Products by Category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={analytics.categoryData}>
              <XAxis dataKey="name" stroke="#777" fontSize={12} />
              <YAxis stroke="#777" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#ffffff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5">
          <h2 className="mb-5 text-xl font-black">Recent Orders</h2>

          <div className="space-y-3">
            {analytics.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col gap-2 rounded-2xl bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">
                    #{order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-white/40">
                    {order.customerName || "Customer"} ·{" "}
                    {order.status || "Pending"}
                  </p>
                </div>

                <p className="font-black">Rs. {order.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5">
      <Icon className="text-white/40" size={24} />
      <p className="mt-4 text-sm text-white/40">{title}</p>
      <h2 className="mt-2 text-2xl font-black sm:text-3xl">{value}</h2>
    </div>
  );
}

function ChartCard({ title, icon: Icon, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5">
      <div className="mb-5 flex items-center gap-3">
        {Icon && <Icon className="text-white/40" size={22} />}
        <h2 className="text-xl font-black">{title}</h2>
      </div>

      {children}
    </div>
  );
}
