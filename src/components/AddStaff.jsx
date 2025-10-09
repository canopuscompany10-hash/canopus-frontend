import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { FaUserPlus } from "react-icons/fa";

function AddStaff() {
  const { user, createUser } = useContext(UserContext); // renamed registerUser → createUser
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Only admin can access
  if (!user || user.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Access Denied — Only Admins Can Add Staff
      </div>
    );
  }

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const newStaff = await createUser(formData); // createUser from UserContext
      if (newStaff) {
        setSuccess("Staff added successfully!");
        setFormData({ name: "", email: "", password: "", role: "staff" });
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      } else {
        setError("Failed to add staff. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-6 flex items-center justify-center gap-2">
          <FaUserPlus /> Add New Staff
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 text-center py-2 rounded mb-3">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-600 text-center py-2 rounded mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter staff name"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter staff email"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Set a password"
              className="border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStaff;
