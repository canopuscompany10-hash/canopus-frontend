import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaUserShield, FaPlus, FaUsers } from "react-icons/fa";
import UserContext from "../context/UserContext";
import CreateUser from "./CreateUser";

function UserManagement() {
  const { allUsers, deleteUser, user: currentUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter out superadmins from the table
  const visibleUsers = allUsers.filter(u => u.role !== "superadmin");

  const filteredUsers = visibleUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = visibleUsers.length;
  const totalAdmins = visibleUsers.filter((u) => u.role.toLowerCase() === "admin").length;
  const totalManagers = visibleUsers.filter((u) => u.role.toLowerCase() === "manager").length;
  const totalStaff = visibleUsers.filter((u) => u.role.toLowerCase() === "staff").length;

  const handleRoleChange = (id, role) => {
    const userIndex = allUsers.findIndex((u) => u._id === id);
    if (userIndex !== -1) allUsers[userIndex].role = role;
    setEditUser(null);
    setNewRole("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      try {
        await deleteUser(id);
        alert("User deleted successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete user.");
      }
    }
  };

  const getRoleOptions = (u) => {
    if (currentUser.role === "superadmin") return ["admin", "manager", "staff"];
    return ["staff"]; // normal admin can only assign Staff
  };

  const canEditOrDelete = (u) => {
    if (currentUser.role === "superadmin") return u.role !== "superadmin";
    if (currentUser.role === "admin") return u.role === "staff";
    return false;
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto px-3 sm:px-6">
      <p className="text-gray-600 text-left text-base sm:text-lg font-medium">
        User Overview — Manage roles and access permissions for your team members.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { title: "Total Users", count: totalUsers, icon: <FaUsers className="text-3xl text-blue-500" />, bg: "bg-blue-100 text-blue-800" },
          { title: "Admins", count: totalAdmins, icon: <FaUserShield className="text-3xl text-red-500" />, bg: "bg-red-100 text-red-800" },
          { title: "Managers", count: totalManagers, icon: <FaUserShield className="text-3xl text-yellow-500" />, bg: "bg-yellow-100 text-yellow-800" },
          { title: "Staff", count: totalStaff, icon: <FaUserShield className="text-3xl text-gray-500" />, bg: "bg-gray-100 text-gray-800" }
        ].map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl p-4 flex flex-col items-center justify-center shadow`}>
            {card.icon}
            <span className="text-lg font-bold mt-2">{card.count}</span>
            <span className="text-sm">{card.title}</span>
          </div>
        ))}
      </div>

      {/* Header + Search + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-red-600" /> Manage Users
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-white shadow-sm p-3 rounded-xl flex-1 md:flex-none w-full md:w-auto">
            <FaSearch className="text-gray-500 text-lg mr-3" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700 text-sm"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm md:text-base"
          >
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      {/* User Table Panel */}
      <div className="flex flex-col border h-[50vh] border-gray-200 rounded-lg overflow-y-scroll">
        <div className="hidden md:flex bg-gray-100 text-gray-700 font-semibold py-3 px-4">
          <div className="w-1/3">User</div>
          <div className="w-1/3">Role</div>
          <div className="w-1/3 text-right">Actions</div>
        </div>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((u, i) => (
            <motion.div
              key={u._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-all ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 w-full md:w-1/3">
                {u.profilePic ? (
                  <img
                    src={u.profilePic}
                    alt={u.name}
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border bg-red-600 flex items-center justify-center text-white font-semibold">
                    {u.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{u.name}</span>
                  <span className="text-gray-500 text-sm">{u.email}</span>
                </div>
              </div>

              {/* Role */}
              <div className="mt-2 md:mt-0 w-full md:w-1/3">
                {editUser === u._id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border rounded-lg p-1 text-sm w-full md:w-auto"
                  >
                    <option value="">Select role</option>
                    {getRoleOptions(u).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.role === "admin" ? "bg-red-100 text-red-700" :
                    u.role === "manager" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{u.role}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2 md:mt-0 w-full md:w-1/3 justify-end">
                {canEditOrDelete(u) && editUser === u._id ? (
                  <button
                    onClick={() => handleRoleChange(u._id, newRole)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                ) : canEditOrDelete(u) ? (
                  <>
                    <button
                      onClick={() => { setEditUser(u._id); setNewRole(u.role); }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </>
                ) : null}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic py-6">No users found.</div>
        )}
      </div>

      {showCreateModal && <CreateUser onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

export default UserManagement;
