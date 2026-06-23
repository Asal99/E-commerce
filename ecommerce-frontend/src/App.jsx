import { Routes, Route } from "react-router-dom";

import { PublicLayout } from "./components/layout/PublicLayout";
import { AuthLayout } from "./components/layout/AuthLayout";
import { AdminLayout } from "./components/layout/AdminLayout";

import Home from "./components/pages/HomePage";
import Shop from "./components/pages/ShopPage";
import ProductDetail from "./components/pages/ProductDetailPage";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Profile from "./components/pages/Profile";

import CartDrawer from "./components/cart/CartDrawer";

import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./components/pages/AdminOrders";
import AdminProducts from "./admin/AdminProducts";

import OrderSuccess from "./components/pages/OrderSuccess";
import TrackOrder from "./components/pages/TrackOrder";
import MyOrders from "./components/pages/MyOrders";
import Cart from "./components/pages/CartPage";
import ScrollToTop from "./components/hooks/scrollToTop";
import AdminLogin from "./admin/AdminLogin";
import PrivateRoute from "./admin/PrivateRoute";
import AdminAnalytics from "./admin/AdminAnalytics";

import CheckOut from "./components/pages/Checkout";
import WishList from "./components/pages/Wishlist";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC LAYOUT */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/wishlist" element={<WishList />} />

          <Route path="/profile" element={<Profile />} />

          {/* NEW ORDER ROUTES */}
          <Route path="/checkout" element={<CheckOut />} />

          <Route path="/order-success/:id" element={<OrderSuccess />} />

          <Route path="/track-order/:id" element={<TrackOrder />} />

          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<PrivateRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
