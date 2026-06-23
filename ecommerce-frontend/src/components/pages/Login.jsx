import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setNotification("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setNotification("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setNotification(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      navigate("/profile");
    } catch (error) {
      console.log(error);
      setNotification("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-black text-white md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1200"
          alt="Login"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-black/50" />

        <h1 className="absolute bottom-12 left-12 text-6xl font-black tracking-tighter">
          AP
        </h1>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6 md:py-20">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">
            Account
          </p>

          <h1 className="mb-3 text-4xl font-black tracking-tighter sm:text-5xl">
            Welcome Back
          </h1>

          <p className="mb-8 text-sm text-white/50 sm:text-base">
            Login to continue your streetwear journey.
          </p>

          {notification && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
              {notification}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-white/40"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-white/40"
            />
          </div>

          <button
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-white py-4 text-sm uppercase tracking-widest text-black disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <p className="mt-6 text-center text-white/50">
            New here?{" "}
            <Link to="/register" className="text-white underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
