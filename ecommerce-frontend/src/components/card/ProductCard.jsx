import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setIsWishlisted(wishlist.some((product) => product._id === item._id));
  }, [item._id]);

  const toggleWishlist = (e) => {
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find((product) => product._id === item._id);

    if (exists) {
      const updatedWishlist = wishlist.filter(
        (product) => product._id !== item._id,
      );

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      setIsWishlisted(false);
    } else {
      localStorage.setItem("wishlist", JSON.stringify([...wishlist, item]));

      setIsWishlisted(true);
    }

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/product/${item._id}`)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-neutral-200 rounded-2xl">
        <img
          src={item.image}
          alt={item.name}
          className="h-105 w-full object-cover group-hover:scale-105 transition duration-700"
        />

        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-3 rounded-full hover:bg-white transition"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${
              isWishlisted ? "fill-black text-black" : "text-black"
            }`}
          />
        </button>

        <button className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition">
          View Product
        </button>
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="font-semibold uppercase tracking-tight">
            {item.name}
          </h3>

          <p className="text-sm text-neutral-500">{item.category}</p>
        </div>

        <p className="font-medium">Rs. {item.price}</p>
      </div>
    </motion.div>
  );
};
