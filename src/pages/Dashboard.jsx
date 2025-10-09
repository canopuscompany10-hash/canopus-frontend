import React, { useState, useContext } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import UserContext from "../context/UserContext";

// Dashboard sections
import UserManagement from "../components/UserManagement";
import WorkManagement from "../components/WorkManagement";
import DashboardHome from "../components/DashboardHome";

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

      case "User Management":
        if (user?.role !== "admin") {
          return (
            <div className="text-center text-red-600 font-semibold mt-20">
              ❌ Access Denied — Admins Only
            </div>
          );
        }
        return <UserManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <AdminSidebar
        active={active}
        setActive={setActive}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-4 text-2xl text-gray-600"
        >
          <FaBars />
        </button>

        <h1 className="text-3xl font-bold pt-7 pl-8 ">{active}</h1>
        <main className="flex-1 p-4 md:px-8 md:py-1 overflow-y-auto ">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
