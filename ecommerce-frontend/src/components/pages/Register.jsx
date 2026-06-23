import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    setNotification("");
  };

  const validateForm = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Enter a valid email address";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    if (!form.agree) {
      return "You must agree before creating an account";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      setNotification(error);
      return;
    }

    try {
      setLoading(true);
      setNotification("");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setNotification(data.message || "Registration failed");
        return;
      }

      setNotification("Account created successfully. Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.log(error);
      setNotification("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = notification.includes("successfully");

  return (
    <main className="grid min-h-screen bg-black text-white md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200"
          alt="Register"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-black/50" />

        <h1 className="absolute bottom-12 left-12 text-6xl font-black tracking-tighter">
          JOIN AP
        </h1>
      </div>

      <div className="flex items-center justify-center px-4 py-16 sm:px-6 md:py-20">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/40">
            Account
          </p>

          <h1 className="mb-3 text-4xl font-black tracking-tighter sm:text-5xl">
            Create Account
          </h1>

          <p className="mb-8 text-sm text-white/50 sm:text-base">
            Build your premium streetwear profile.
          </p>

          {notification && (
            <div
              className={`mb-5 rounded-2xl border px-5 py-4 text-sm ${
                isSuccess
                  ? "border-green-500/30 bg-green-500/10 text-green-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {notification}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-white/40"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-white/40"
            />

            <div className="flex items-center rounded-2xl border border-white/10 bg-white/10 focus-within:border-white/40">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent px-5 py-4 outline-none placeholder:text-white/40"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 text-white/50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-5 py-4 outline-none placeholder:text-white/40 focus:border-white/40"
            />
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm text-white/60">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mt-1 accent-white"
            />

            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-white underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy-policy" className="text-white underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-white py-4 text-sm uppercase tracking-widest text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="mt-6 text-center text-white/50">
            Already have account?{" "}
            <Link to="/login" className="text-white underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
