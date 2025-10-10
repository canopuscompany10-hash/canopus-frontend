import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Fetch gallery images with pagination
  const fetchImages = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(`/gallery?page=${pageNumber}&limit=8`);
      setImages(res.data.images || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Fetch gallery failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "gallery");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  // Add new image
  const addImage = async (file) => {
    try {
      const imageURL = await uploadToCloudinary(file);
      await AxiosInstance.post("/gallery", { image: imageURL });
      fetchImages(1);
    } catch (err) {
      console.error("Add gallery image failed:", err);
      throw err;
    }
  };

  // Delete image
  const deleteImage = async (id) => {
    try {
      await AxiosInstance.delete(`/gallery/${id}`);
      fetchImages(page);
    } catch (err) {
      console.error("Delete gallery image failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        images,
        loading,
        error,
        page,
        totalPages,
        fetchImages,
        addImage,
        deleteImage,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryContext;
