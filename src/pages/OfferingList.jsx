import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";
import homeImage from "../assets/homeimage.jpg";

function OfferingList() {
  const { user, addToCart, savedItems = [] } = useContext(UserContext); // default empty array
  const [isAdmin, setIsAdmin] = useState(true); // toggle true/false for Admin/User
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", desc: "", image: "" });
  const [previewImg, setPreviewImg] = useState(null);

  const [beverages, setBeverages] = useState([
    {
      name: "Cappuccino",
      desc: "Rich espresso with steamed milk",
      image: homeImage,
    },
    { name: "Green Tea", desc: "Refreshing and healthy", image: homeImage },
    { name: "Lemonade", desc: "Freshly squeezed lemons", image: homeImage },
    { name: "Smoothie", desc: "Fruit blended with yogurt", image: homeImage },
    { name: "Espresso", desc: "Strong and bold coffee", image: homeImage },
  ]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(beverages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = beverages.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // User add to cart
  const handleAddToCart = (item) => {
    if (!user) return alert("Please login to add items!");
    if (savedItems.some((saved) => saved.name === item.name))
      return alert("Item already in cart!");
    addToCart({ ...item, quantity: 1 });
  };

  // Admin add item handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImg(ev.target.result);
      setNewItem({ ...newItem, image: ev.target.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.image)
      return alert("Please fill all fields and upload an image!");
    setBeverages((prev) => [...prev, newItem]);
    setNewItem({ name: "", desc: "", image: "" });
    setPreviewImg(null);
    setShowAddPopup(false);
  };

  return (
    <div className="p-4 pt-24 relative">
      <h2 className="kaushan-script-regular text-4xl md:text-5xl text-center text-yellow-800 mb-10">
        Our Beverages
      </h2>

      {/* Admin Add Button */}
      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddPopup(true)}
          className="absolute top-20 right-6 md:right-20 bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:bg-red-600"
        >
          + Add Item
        </motion.button>
      )}

      {/* Beverage Grid */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {currentItems.map((item, index) => {
            const isAdded = savedItems.some(
              (saved) => saved.name === item.name
            );
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col text-center p-2"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-28 object-cover mb-2 rounded"
                />
                <h3 className="text-md font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-xs mb-2">{item.desc}</p>

                {!isAdmin && (
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isAdded}
                    className={`mt-1 px-2 py-1 rounded text-xs w-full ${
                      isAdded
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {isAdded ? "Added" : "Add to Booking list"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-600 italic">
          No beverages listed yet.
          {isAdmin && (
            <p className="mt-2 text-sm text-gray-500">
              Click <b>“+ Add Item”</b> to add new beverages.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Item Popup */}
      <AnimatePresence>
        {showAddPopup && (
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
              className="bg-white text-red-500 rounded-2xl p-6 w-96 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold mb-5 text-center">
                Add New Beverage
              </h3>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter beverage name"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-400"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                />

                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-400"
                  value={newItem.desc}
                  onChange={(e) =>
                    setNewItem({ ...newItem, desc: e.target.value })
                  }
                />

                <label className="text-sm font-semibold text-gray-700">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border border-gray-300 rounded-lg p-2 bg-gray-50"
                />
                {previewImg && (
                  <img
                    src={previewImg}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto mt-2 border-2 border-red-400"
                  />
                )}
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setShowAddPopup(false);
                    setPreviewImg(null);
                    setNewItem({ name: "", desc: "", image: "" });
                  }}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
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

export default OfferingList;
