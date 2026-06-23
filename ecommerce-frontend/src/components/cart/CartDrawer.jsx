import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CartDrawer = ({ open, setOpen }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, [open]);

  const saveCart = (items) => {
    setCart(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id, size) => {
    const updated = cart.filter(
      (item) => !(item._id === id && item.size === size),
    );

    saveCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-112.5 bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-black tracking-tight">Your Cart</h2>

          <button
            onClick={() => setOpen(false)}
            className="hover:rotate-90 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-neutral-500 text-lg">Your cart is empty.</p>

              <button
                onClick={() => setOpen(false)}
                className="mt-6 bg-black text-white px-8 py-4 uppercase tracking-widest text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex gap-4 border-b border-black/5 pb-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-28 object-cover rounded-2xl bg-neutral-100"
                />

                <div className="flex-1">
                  <h3 className="font-semibold uppercase tracking-tight">
                    {item.name}
                  </h3>

                  <p className="text-sm text-neutral-500 mt-1">
                    Size: {item.size}
                  </p>

                  <p className="text-sm text-neutral-500">Qty: {item.qty}</p>

                  <p className="mt-3 font-bold">Rs. {item.price}</p>
                </div>

                <button
                  onClick={() => removeItem(item._id, item.size)}
                  className="text-neutral-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6">
            <div className="flex justify-between text-lg font-bold mb-5">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>

            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="block w-full text-center bg-black text-white py-4 uppercase tracking-widest text-sm hover:bg-neutral-800 transition"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
