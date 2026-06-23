import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  BarChart3,
  X,
} from "lucide-react";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  ];

  const Sidebar = () => (
    <>
      <h1 className="mb-10 text-3xl font-black tracking-tighter">AP ADMIN</h1>

      <nav className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-5 py-4 ${
                  isActive ? "bg-white text-black" : "hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={logout}
        className="mt-10 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm uppercase tracking-widest text-black"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white md:grid md:grid-cols-[280px_1fr]">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black px-4 py-4 md:hidden">
        <h1 className="text-xl font-black">AP ADMIN</h1>

        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </header>

      <aside className="hidden border-r border-white/10 bg-black p-6 md:block">
        <Sidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/70 md:hidden">
          <aside className="h-full w-72 bg-black p-6">
            <button
              onClick={() => setOpen(false)}
              className="mb-6 ml-auto block rounded-xl bg-white/10 p-2"
            >
              <X />
            </button>

            <Sidebar />
          </aside>
        </div>
      )}

      <section className="p-4 sm:p-6 md:p-10">
        <Outlet />
      </section>
    </main>
  );
};
