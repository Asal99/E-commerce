import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#f5f2ec] text-black">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
