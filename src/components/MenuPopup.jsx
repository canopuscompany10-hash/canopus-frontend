import React, { useState, useContext } from "react";
import MenuContext from "../context/MenuContext";

function MenuPopup({ onClose, itemToEdit }) {
  const { addMenuItem, updateMenuItem, categories } = useContext(MenuContext);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const [formData, setFormData] = useState({
    name: itemToEdit?.name || "",
    price: itemToEdit?.price || "",
    category: itemToEdit?.category || "All",
    image: itemToEdit?.image || "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 

  const capitalizeFirstLetter = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Enter a valid price";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.image) newErrors.image = "Please upload an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return setErrors({ image: "No file selected" });

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: "" }));

    try {
      const cloudForm = new FormData();
      cloudForm.append("file", selectedFile);
      cloudForm.append("upload_preset", UPLOAD_PRESET);
      cloudForm.append("folder", "canopus_gallery_images");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudForm }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setErrors((prev) => ({
        ...prev,
        image: "Image upload failed. Try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    try {
      if (itemToEdit) {
        await updateMenuItem(itemToEdit._id, formData);
        setSuccessMessage("Menu item updated successfully!");
      } else {
        await addMenuItem(formData);
        setSuccessMessage("Menu item added successfully!");
        setFormData({ name: "", price: "", category: "All", image: "" }); 
      }

      // Hide message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      // onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save item. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: capitalizeFirstLetter(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({
                ...formData,
                price: parseFloat(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: capitalizeFirstLetter(e.target.value),
              })
            }
            className="border p-2 rounded w-full"
          >
            <option value="All">All</option>
            {categories
              .filter((cat) => cat !== "All")
              .map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {uploading && <p className="text-gray-500 text-sm">Uploading...</p>}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
        </div>

        {errors.form && (
          <p className="text-red-500 text-sm text-center">{errors.form}</p>
        )}

        {/*  Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center font-semibold">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition w-full"
        >
          {uploading
            ? "Saving..."
            : itemToEdit
            ? "Update Item"
            : "Add Item"}
        </button>
      </form>
    </div>
  );
}

export default MenuPopup;
