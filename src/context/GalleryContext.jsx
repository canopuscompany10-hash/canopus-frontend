// context/GalleryContext.jsx
import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch gallery images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/gallery");
      setImages(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Fetch gallery failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new gallery image
  const addImage = async (imageURL) => {
    try {
      await AxiosInstance.post("/gallery", { image: imageURL });
      fetchImages(); // refresh
    } catch (err) {
      console.error("Add gallery image failed:", err);
      throw err;
    }
  };

  // Delete gallery image
  const deleteImage = async (id) => {
    try {
      await AxiosInstance.delete(`/gallery/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Delete gallery image failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        images,
        loading,
        error,
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
