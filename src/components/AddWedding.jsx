import React, { useState, useContext } from "react";
import axios from "axios";
import WeddingContext from "../context/WeddingContext";

function AddWedding({ onClose }) {
  const { addWedding } = useContext(WeddingContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Capitalize first letter of each word
  const capitalize = (text) =>
    text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await handleImageUpload();
    if (!imageUrl) {
      alert("Image upload failed");
      setLoading(false);
      return;
    }

    try {
      await addWedding({
        title: capitalize(title),
        description: capitalize(description),
        image: imageUrl,
      });
      setTitle("");
      setDescription("");
      setImage(null);
      if (onClose) onClose(); // Close popup
    } catch (err) {
      console.error(err);
      alert("Failed to add wedding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
          Add Wedding
        </h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Wedding Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded focus:outline-red-500"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded focus:outline-red-500"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="border p-1 rounded"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-500 text-white p-2 rounded flex-1 hover:bg-red-600 transition"
            >
              {loading ? "Uploading..." : "Add Wedding"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 p-2 rounded flex-1 hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWedding;
