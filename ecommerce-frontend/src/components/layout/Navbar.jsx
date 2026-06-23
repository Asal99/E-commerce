import { Link } from "react-router-dom";
import { Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import SearchDropdown from "../navbar/SerarchDropdown";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  const navLinks = [
    ["Shop", "/shop"],
    ["Wishlist", "/wishlist"],
    ["Cart", "/cart"],
    ["Profile", "/profile"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      setWishlistCount(wishlist.length);
      setCartCount(cart.reduce((total, item) => total + (item.qty || 1), 0));

      try {
        const savedUser = localStorage.getItem("user");
        setUser(
          savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null,
        );
      } catch {
        setUser(null);
      }
    };

    update();

    window.addEventListener("wishlistUpdated", update);
    window.addEventListener("cartUpdated", update);
    window.addEventListener("storage", update);

    return () => {
      window.removeEventListener("wishlistUpdated", update);
      window.removeEventListener("cartUpdated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  const badgeClass = `absolute -right-2 -top-2 rounded-full px-1 text-[10px] ${
    scrolled ? "bg-white text-black" : "bg-black text-white"
  }`;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-black/85 text-white shadow-lg backdrop-blur-xl"
          : "bg-transparent text-black"
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10">
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter sm:text-4xl"
        >
          AP
        </Link>

        <nav className="hidden items-center gap-8 text-sm uppercase tracking-widest md:flex lg:text-lg">
          {navLinks.slice(0, 3).map(([name, path]) => (
            <Link key={name} to={path} className="hover:opacity-60">
              {name}
            </Link>
          ))}
        </nav>

        <div className="hidden max-w-sm flex-1 lg:block">
          <SearchDropdown scrolled={scrolled} />
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <IconLink
            to="/wishlist"
            count={wishlistCount}
            badgeClass={badgeClass}
          >
            <Heart size={21} />
          </IconLink>

          <IconLink to="/cart" count={cartCount} badgeClass={badgeClass}>
            <ShoppingBag size={21} />
          </IconLink>

          <Link to="/profile">
            {user ? (
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  scrolled ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                {initials}
              </div>
            ) : (
              <User size={22} />
            )}
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="space-y-5 bg-black px-6 py-8 text-sm uppercase tracking-widest text-white md:hidden">
          <div className="mb-4">
            <SearchDropdown scrolled />
          </div>

          {navLinks.map(([name, path]) => (
            <Link
              key={name}
              to={path}
              className="block"
              onClick={() => setOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

function IconLink({ to, count, badgeClass, children }) {
  return (
    <Link to={to} className="relative">
      {children}
      {count > 0 && <span className={badgeClass}>{count}</span>}
    </Link>
  );
}
