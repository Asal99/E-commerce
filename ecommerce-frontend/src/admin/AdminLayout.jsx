import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Grid2X2,
  ShoppingBag,
  Package,
  Tags,
  Image,
  Mail,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const links = [
    { name: "Home", path: "/admin/dashboard", icon: Home },
    { name: "Category", path: "/admin/category", icon: Grid2X2 },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Tags", path: "/admin/tags", icon: Tags },
    { name: "Banner Images", path: "/admin/banners", icon: Image },
    { name: "Inquiries", path: "/admin/inquiries", icon: Mail },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight">Admin</h1>
        <p className="mt-1 text-xs text-white/40">Dashboard Panel</p>
      </div>

      <div className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border p-2"
          aria-label="Open admin menu"
        >
          <Menu size={22} />
        </button>

        <h2 className="text-sm font-black uppercase tracking-widest">
          Admin Panel
        </h2>
      </header>

      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col bg-black p-6 text-white lg:flex">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="relative z-10 flex h-full w-72 max-w-[85%] flex-col bg-black p-6 text-white">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-lg bg-white/10 p-2"
              aria-label="Close admin menu"
            >
              <X size={20} />
            </button>

            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="p-4 sm:p-6 lg:ml-72 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
};
