import React, { useState, useContext } from "react";
import { FaEdit, FaSave, FaLock, FaCamera } from "react-icons/fa";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

function SettingsSection() {
  const { user, updateUser } = useContext(UserContext);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    profilePic: user?.profilePic || "",
  });

  // const [resetLoading, setResetLoading] = useState(false);
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Handle form input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle profile picture upload with Cloudinary
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
        {
          method: "POST",
          body: cloudData,
        }
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

  // Save profile changes
  const handleSubmitProfile = async () => {
    setLoading(true);
    setSuccess("");
    try {
      await updateUser(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setSuccess("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Request password reset email
  // const handlePasswordResetRequest = async () => {
  //   if (!user?.email) return toast.error("Email not available.");
  //   setResetLoading(true);
  //   try {
  //     await requestPasswordReset(user.email);
  //     toast.success(
  //       "Password reset email sent! Check your inbox to reset your password."
  //     );
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to send password reset email.");
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <img
            src={formData.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 border-red-600"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-red-600 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition">
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

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Profile Info</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-red-600 hover:text-red-700 text-lg"
            >
              {isEditing ? <FaSave /> : <FaEdit />}
            </button>
          </div>

          <div className="space-y-3">
            {/* Name */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 font-medium mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
                />
              ) : (
                <p className="text-gray-800 font-medium">{user?.email}</p>
              )}
            </div>

            {isEditing && (
              <button
                onClick={handleSubmitProfile}
                disabled={loading}
                className={`mt-4 w-full bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Save Profile"}
              </button>
            )}

            {success && <p className="mt-2 text-green-600 font-medium">{success}</p>}

           
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
