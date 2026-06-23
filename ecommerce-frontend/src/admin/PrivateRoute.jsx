import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const adminToken = localStorage.getItem("adminToken");

  if (!admin || !adminToken || admin.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
