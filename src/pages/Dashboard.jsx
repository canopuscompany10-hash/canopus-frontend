import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/DashboardSidebar";
import UserContext from "../context/UserContext";

// Dashboard sections
import UserManagement from "../components/UserManagement";
import WorkManagement from "../components/WorkManagement";
import DashboardHome from "../components/DashboardHome";
import SettingsSection from "../components/SettingsSection";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  const { user } = useContext(UserContext);

  const renderContent = () => {
    switch (active) {
      case "Dashboard":
      default:
        return <DashboardHome />;

      case "Works":
        return <WorkManagement />;

      case "Settings":
        return <SettingsSection />;

      case "User Management":
        if (user?.role !== "admin") {
          return (
            <div className="text-center text-red-600 font-semibold mt-20">
              Access Denied — Admins Only
            </div>
          );
        }
        return <UserManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Sticky Top Header with Mobile Menu */}
        <div className="sticky top-0 z-20 bg-gray-50 flex items-center justify-start gap-4 p-4 md:p-6 border-b border-gray-200">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-2xl text-gray-600"
          >
            <FaBars />
          </button>

          {/* Section Title */}
          <h1 className="text-3xl font-bold text-left pt-1">{active}</h1>
        </div>

        {/* Main scrollable content */}
        <main className="flex-1  py-4 md:py-4 md:overflow-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
