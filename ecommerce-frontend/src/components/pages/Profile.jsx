import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Package, LogOut, User } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (!savedUser || savedUser === "undefined") {
        localStorage.removeItem("user");
        return setUser(null);
      }

      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f2] px-4">
        <div className="w-full max-w-md rounded-4xl border border-black/5 bg-white p-8 text-center shadow-xl sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white">
            <User size={32} />
          </div>

          <h1 className="mb-4 text-4xl font-black tracking-tighter text-black sm:text-5xl">
            Welcome
          </h1>

          <p className="mb-8 text-neutral-500">
            Sign in to view your orders, wishlist and account details.
          </p>

          <Link
            to="/login"
            className="inline-block rounded-full bg-black px-8 py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-800"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AP";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f2] px-4 py-24 text-black sm:px-6 md:px-14">
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-black/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">
          Customer Dashboard
        </p>

        <h1 className="mb-10 text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl">
          Profile
        </h1>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="rounded-4xl border border-black/5 bg-white p-7 shadow-xl sm:p-8">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-black text-3xl font-black text-white shadow-xl sm:h-28 sm:w-28 sm:text-4xl">
              {initials}
            </div>

            <h2 className="text-3xl font-black tracking-tighter sm:text-4xl">
              {user.name || "User"}
            </h2>

            <p className="mt-3 break-all text-neutral-500">{user.email}</p>

            <div className="mt-8 border-t border-black/5 pt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                Account Status
              </p>

              <p className="mt-3 inline-block rounded-full border border-green-500/20 bg-green-100 px-4 py-2 text-sm text-green-700">
                Active Customer
              </p>
            </div>

            <button
              onClick={logout}
              className="mt-10 flex w-full items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-sm uppercase tracking-widest text-white hover:bg-neutral-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileCard
              title="Orders"
              subtitle="Track purchases and history"
              icon={Package}
              link="/my-orders"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileCard({ title, subtitle, icon: Icon, link }) {
  return (
    <Link
      to={link}
      className="group rounded-[28px] border border-black/5 bg-white p-7 shadow-sm transition hover:bg-black hover:text-white hover:shadow-xl"
    >
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-white group-hover:text-black">
        <Icon size={22} />
      </div>

      <h3 className="text-2xl font-black tracking-tighter">{title}</h3>

      <p className="mt-2 text-sm text-neutral-500 group-hover:text-white/70">
        {subtitle}
      </p>
    </Link>
  );
}
