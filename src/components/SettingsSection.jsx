import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";

function SettingsSection() {
  const { user, updateUser, updateNotifications } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    profilePic: user?.profilePic || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      const updates = { ...formData };
      if (!updates.password) delete updates.password; // only update password if provided

      const updatedUser = await updateUser(updates);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setSuccess("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Profile Settings</h2>

      {success && <p className="mb-4 text-green-600 font-medium">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Profile Picture URL</label>
          <input
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            placeholder="Profile picture URL"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default SettingsSection;
