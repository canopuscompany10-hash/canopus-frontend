import React, { useState, useContext } from "react";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

function SettingsSection() {
  const { user, setUser, updateUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
    totalWorkCompleted: user?.totalWorkCompleted || 0,
  });

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudData = new FormData();
    cloudData.append("file", file);
    cloudData.append("upload_preset", UPLOAD_PRESET);
    cloudData.append("folder", "profile_pics");

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudData }
      );
      const data = await res.json();
      setFormData({ ...formData, profilePic: data.secure_url });
      toast.success("Profile picture uploaded!");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      toast.error("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProfile = async () => {
    setLoading(true);
    setSuccess("");
    try {
      const updated = await updateUser(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData({ ...formData, totalWorkCompleted: updated.totalWorkCompleted });
      setUser(updated);
    } catch (err) {
      console.error(err);
      setSuccess("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-2xl">
        
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={formData.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-red-600 shadow-lg"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-red-600 text-white p-3 rounded-full cursor-pointer hover:bg-red-700 transition transform hover:scale-110">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Profile Info</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-red-600 hover:text-red-700 text-xl transition transform hover:scale-110"
            >
              {isEditing ? <FaSave /> : <FaEdit />}
            </button>
          </div>

          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-800 font-semibold text-lg">{formData.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition"
                />
              ) : (
                <p className="text-gray-800 font-semibold text-lg">{formData.email}</p>
              )}
            </div>

            {/* Total Work Completed */}
            {!isEditing && (
              <div>
                <label className="block text-gray-600 font-medium mb-2">
                  Total Work Completed
                </label>
                <p className="text-gray-800 font-semibold text-lg">
                  {formData.totalWorkCompleted}
                </p>
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSubmitProfile}
                disabled={loading}
                className={`mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-semibold transition transform hover:scale-105 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Save Profile"}
              </button>
            )}

            {/* Success Message */}
            {success && <p className="mt-3 text-green-600 font-medium">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
