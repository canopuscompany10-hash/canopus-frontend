

import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaUserShield, FaPlus, FaUsers } from "react-icons/fa";
import UserContext from "../context/UserContext";
import CreateUser from "./CreateUser";

function UserManagement() {
  const { allUsers } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role.toLowerCase() === "admin").length;
  const totalManagers = allUsers.filter((u) => u.role.toLowerCase() === "manager").length;
  const totalStaff = allUsers.filter((u) => u.role.toLowerCase() === "staff").length;

  const handleRoleChange = (id, role) => {
    const userIndex = allUsers.findIndex((u) => u._id === id);
    if (userIndex !== -1) {
      allUsers[userIndex].role = role;
    }
    setEditUser(null);
    setNewRole("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this user?")) {
      const filtered = allUsers.filter((u) => u._id !== id);
      setEditUser(null);
    }
  };

  return (
    <div className="flex flex-col  gap-4  md:w-[100%]  w-[90%] px-2 ">

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:w-[100%]  w-[90%]  sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Users", count: totalUsers, icon: <FaUsers className="text-3xl text-blue-500" />, bg: "bg-blue-100 text-blue-800" },
          { title: "Admins", count: totalAdmins, icon: <FaUserShield className="text-3xl text-red-500" />, bg: "bg-red-100 text-red-800" },
          { title: "Managers", count: totalManagers, icon: <FaUserShield className="text-3xl text-yellow-500" />, bg: "bg-yellow-100 text-yellow-800" },
          { title: "Staff", count: totalStaff, icon: <FaUserShield className="text-3xl text-gray-500" />, bg: "bg-gray-100 text-gray-800" },
        ].map((card, i) => (
          <div
            key={i}
            className={`${card.bg} rounded-xl p-4 flex flex-col items-center justify-center shadow w-[100%]`}
          >
            {card.icon}
            <span className="text-lg font-bold mt-2">{card.count}</span>
            <span className="text-sm">{card.title}</span>
          </div>
        ))}
      </div>

      {/* Header + Search + Add Button */}
   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:w-[100%] w-[90%]">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <FaUserShield className="text-red-600" /> Manage Users
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <div className="flex items-center bg-white shadow-sm p-3 rounded-xl flex-1 md:flex-none">
            <FaSearch className="text-gray-500 text-lg mr-3" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <FaPlus /> Add User
          </button>
        </div>
      </div>



      {/* Users Table */}
      <div className="overflow-x-auto shadow rounded-xl md:w-[100%] w-[90%] ">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="py-3 px-4 flex items-center gap-2 whitespace-nowrap">
                  <img
                    src={
                      u.image ||
                      `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${i + 30}.jpg`
                    }
                    alt={u.name}
                    className="w-8 h-8 rounded-full border"
                  />
                  {u.name}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{u.email}</td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {editUser === u._id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="border rounded-lg p-1 text-sm w-full"
                    >
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="staff">Staff</option>
                      <option value="customer">Customer</option>
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "manager"
                          ? "bg-yellow-100 text-yellow-700"
                          : u.role === "staff"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center whitespace-nowrap flex justify-center gap-2 flex-wrap">
                  {editUser === u._id ? (
                    <button
                      onClick={() => handleRoleChange(u._id, newRole)}
                      className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditUser(u._id);
                          setNewRole(u.role);
                        }}
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
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showCreateModal && <CreateUser onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

export default UserManagement;
