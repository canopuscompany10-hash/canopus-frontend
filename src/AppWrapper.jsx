import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WeddingList from "./pages/WeddingList";
import SetPassword from "./pages/SetPassword";

function AppWrapper() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/set-password/:token" element={<SetPassword />} />

      <Route path="/login" element={<Login />} />
      <Route path="/weddings" element={<WeddingList />} />

      {/* Dashboard accessible by admin and staff */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "superadmin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppWrapper;
