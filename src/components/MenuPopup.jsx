import React, { useState, useContext } from "react";
import MenuContext from "../context/MenuContext";

function MenuPopup({ onClose, itemToEdit }) {
  const { addMenuItem, updateMenuItem, categories } = useContext(MenuContext);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [formData, setFormData] = useState({
    name: itemToEdit?.name || "",
    description: itemToEdit?.description || "",
    price: itemToEdit?.price || "",
    // Default category to "All" if none selected
    category: itemToEdit?.category || "All",
    image: itemToEdit?.image || "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Upload image to Cloudinary
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return alert("No file selected!");
    setUploading(true);

    try {
      const formDataCloud = new FormData();
      formDataCloud.append("file", selectedFile);
      formDataCloud.append("upload_preset", UPLOAD_PRESET);
      formDataCloud.append("folder", "canopus_gallery_images");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formDataCloud }
      );

      if (!res.ok) throw new Error("Network error during Cloudinary upload");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
      setFile(selectedFile);
      alert("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("❌ Image upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  // Submit menu item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please upload an image first!");
    if (!formData.name || !formData.price) return alert("Fill required fields");

    setUploading(true);
    try {
      if (itemToEdit) {
        await updateMenuItem(itemToEdit._id, formData);
      } else {
        await addMenuItem(formData);
      }
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to save menu item.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          required
          className="border p-2 rounded w-full"
        />

        {/* Category selector */}
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          {/* Always include "All" as default first option */}
          <option value="All">All</option>
          {categories
            .filter((cat) => cat !== "All")
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Uploading image...</p>}
        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          {itemToEdit ? "Update Item" : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default MenuPopup;
