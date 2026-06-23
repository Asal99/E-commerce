import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative h-screen bg-black text-white overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200"
        alt="Streetwear"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-14 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="uppercase tracking-[0.4em] text-sm mb-4"
        >
          New Season / Street Uniform
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-6xl md:text-8xl font-black tracking-tighter max-w-4xl"
        >
          BUILT FOR THE CITY
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/shop"
            className="inline-block mt-8 bg-white text-black px-8 py-4 text-sm uppercase tracking-widest hover:bg-neutral-200 transition"
          >
            Shop Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
