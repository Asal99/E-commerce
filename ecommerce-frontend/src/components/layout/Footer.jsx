import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const links = {
    Shop: [
      ["Shop All", "/shop"],
      ["Wishlist", "/wishlist"],
      ["Cart", "/cart"],
    ],
    Account: [
      ["Profile", "/profile"],
      ["My Orders", "/my-orders"],
      ["Login", "/login"],
      ["Register", "/register"],
    ],
    Support: [
      ["Track Order", "/my-orders"],
      ["Contact", "/contact"],
      ["Shipping Policy", "/shipping-policy"],
      ["Returns Policy", "/returns-policy"],
    ],
    Legal: [
      ["Privacy Policy", "/privacy-policy"],
      ["Terms & Conditions", "/terms"],
    ],
  };

  const socials = [FaFacebookF, FaInstagram, FaPinterestP, FaYoutube];

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          title: "Newsletter Subscription",
          name: "AP Streetwear Subscriber",
          email,
          message: `New newsletter subscriber: ${email}`,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setEmail("");
      setStatus("Successfully subscribed!");
    } catch (error) {
      console.log("EmailJS Error:", error);
      setStatus("Subscription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0b0b0b] px-4 py-12 text-sm text-white sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tighter sm:text-5xl">
            Join The Streetwear Circle
          </h2>

          <p className="mb-6 text-white/50">
            Get drops, restocks and exclusive updates.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mx-auto flex max-w-xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:flex-row sm:rounded-full"
          >
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("");
              }}
              className="flex-1 bg-transparent px-5 py-4 text-white outline-none placeholder:text-white/40"
            />

            <button
              disabled={loading}
              className="bg-white px-6 py-4 text-xs uppercase tracking-widest text-black disabled:opacity-60"
            >
              {loading ? "Sending..." : "Subscribe"}
            </button>
          </form>

          {status && <p className="mt-4 text-sm text-white/60">{status}</p>}
        </div>

        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="mb-4 uppercase tracking-widest text-white/40">
                {title}
              </h3>

              <ul className="space-y-3 text-white/70">
                {items.map(([name, path]) => (
                  <li key={name}>
                    <Link to={path} className="transition hover:text-white">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-white/40">
            © {new Date().getFullYear()} AP Streetwear. All rights reserved.
          </p>

          <div className="flex gap-5 text-lg text-white/70">
            {socials.map((Icon, index) => (
              <a key={index} href="#" className="transition hover:text-white">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
