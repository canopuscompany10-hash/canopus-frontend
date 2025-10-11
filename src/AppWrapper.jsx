import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
// import OfferingList from "./pages/OfferingList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function AppWrapper() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* <Route path="/offerings" element={<OfferingList />} /> */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppWrapper;
