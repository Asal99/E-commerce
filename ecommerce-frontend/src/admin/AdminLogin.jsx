import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = form.email.trim();

    if (!email || !form.password) {
      setError("Please enter admin email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Admin login failed");
        return;
      }

      localStorage.setItem("admin", JSON.stringify(data));
      localStorage.setItem("adminToken", data.token);

      navigate("/admin");
    } catch (error) {
      console.log(error);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-4xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black">
          <Lock size={24} />
        </div>

        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">
          Admin Access
        </p>

        <h1 className="mb-8 text-4xl font-black tracking-tighter sm:text-5xl">
          Admin Login
        </h1>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/40"
          />

          <input
            type="password"
            name="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white py-4 text-sm font-black uppercase tracking-widest text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </main>
  );
}
