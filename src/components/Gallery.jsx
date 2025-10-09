import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryContext from "../context/GalleryContext";
import UserContext from "../context/UserContext"; // ✅ Import UserContext

function Gallery() {
  const { images, loading, addImage, deleteImage } = useContext(GalleryContext);
  const { user } = useContext(UserContext); // ✅ Get user role
  const role = user?.role || "customer"; // default to customer

  const [visibleCount, setVisibleCount] = useState(4);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  const loadMore = () =>
    setVisibleCount((prev) => Math.min(prev + 4, images.length));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImg(ev.target.result);
      setNewImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async () => {
    if (!newImage) return alert("Please select an image to upload!");
    await addImage(newImage);
    setNewImage(null);
    setPreviewImg(null);
    setShowAddPopup(false);
  };

  return (
    <div id="gallery" className="py-12 bg-gray-100 relative">
      <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>

      {/* Admin Add Button */}
      {role === "admin" && (
        <button
          onClick={() => setShowAddPopup(true)}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
        >
          + Add Image
        </button>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-12">
          <AnimatePresence>
            {images.slice(0, visibleCount).map((img, index) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="overflow-hidden rounded-xl shadow-lg relative"
              >
                <img
                  src={img.image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Admin Delete Button */}
                {role === "admin" && (
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this image?"
                        )
                      ) {
                        deleteImage(img._id);
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < images.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Add Image Popup */}
      <AnimatePresence>
        {showAddPopup && role === "admin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-96 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold mb-5 text-center">
                Add New Image
              </h3>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-red-400"
              />

              {previewImg && (
                <img
                  src={previewImg}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 border-2 border-red-400"
                />
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setShowAddPopup(false);
                    setNewImage(null);
                    setPreviewImg(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Gallery;
