import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import DashboardSidebar from "../components/DashboardSidebar";
import UserContext from "../context/UserContext";

// Sections
import DashboardHome from "../components/DashboardHome";
import WorkManagement from "../components/WorkManagement";
import UserManagement from "../components/UserManagement";
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
        if (user?.role !== "admin" && user?.role !== "superadmin") {
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
    <div className="flex min-h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Header */}
        <div className="sticky top-0 z-20 bg-gray-50 flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-2xl text-gray-600"
            >
              <FaBars />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold">{active}</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto py-6  bg-white w-[100%]">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
