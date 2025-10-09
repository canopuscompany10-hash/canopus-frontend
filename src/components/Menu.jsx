import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuContext from "../context/MenuContext";
import UserContext from "../context/UserContext";
import MenuPopup from "./MenuPopup";

function Menu() {
  const { menuItems, addMenuItem, loading } = useContext(MenuContext);
  const { user } = useContext(UserContext);
  const role = user?.role || "customer";

  const [activeCategory, setActiveCategory] = useState("Starter");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showMenuPopup, setShowMenuPopup] = useState(false);

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: activeCategory,
    image: "",
  });
  const [previewImg, setPreviewImg] = useState(null);

  const itemsPerPage = 4;
  const currentCategoryItems = menuItems.filter((item) => item.category === activeCategory);
  const totalPages = Math.ceil(currentCategoryItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = currentCategoryItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  /*** Move these into popup form ***/
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

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price || !newItem.image) {
      return alert("Please fill all fields and upload an image!");
    }
    try {
      await addMenuItem(newItem);
      setNewItem({ name: "", description: "", price: "", category: activeCategory, image: "" });
      setPreviewImg(null);
      setShowAddPopup(false);
    } catch (err) {
      console.error("Failed to add menu item:", err);
    }
  };
  /*** End ***/

  return (
    <div id="menu" className="min-h-screen py-16 px-6 md:px-20 bg-red-500 text-white relative overflow-hidden">
      <div className="flex justify-between items-center mb-10 relative">
        <h2 className="kaushan-script-regular text-4xl md:text-5xl text-center w-full">
          Catering Menu
        </h2>

        {/* Admin Add Button */}
        {role === "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddPopup(true)}
            className="bg-white text-red-500 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white/90 absolute right-6 top-16 md:right-20"
          >
            + Add Item
          </motion.button>
        )}

        {/* Customer Select Items Button */}
        {role !== "admin" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMenuPopup(true)}
            className="bg-white text-red-500 font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white/90 absolute right-6 top-16 md:right-20"
          >
            Select Items
          </motion.button>
        )}
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["Starter", "Main Course", "Drinks", "Offers", "Our Special"].map((cat) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 ${
              activeCategory === cat
                ? "bg-white text-red-500 border-white"
                : "border-white text-white hover:bg-white hover:text-red-500"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Menu Items */}
      {loading ? (
        <p className="text-center text-white">Loading menu items...</p>
      ) : currentItems.length > 0 ? (
        <motion.div
          key={activeCategory + currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {currentItems.map((item) => (
            <motion.div
              key={item._id}
              className="flex items-center justify-between gap-4 p-4 border-b border-dotted border-white transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
              </div>
              <span className="text-white font-bold">{item.price}</span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="col-span-2 text-center py-16 text-white/80 text-lg italic">
          No items listed yet in <span className="font-semibold">{activeCategory}</span>.
          {role === "admin" && (
            <p className="mt-2 text-sm text-white/70">
              Click <span className="font-semibold">“+ Add Item”</span> to add one.
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
            className="px-4 py-2 rounded bg-white text-red-500 disabled:opacity-50 hover:bg-white/80 transition-colors"
          >
            Prev
          </button>
          <span className="px-3 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-white text-red-500 disabled:opacity-50 hover:bg-white/80 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Item Popup */}
      <AnimatePresence>
        {showAddPopup && role === "admin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white text-red-500 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
              <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Add Menu Item</h2>
              <button
                onClick={() => setShowAddPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="border p-2 rounded"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="border p-2 rounded"
                >
                  {["Starter", "Main Course", "Drinks", "Offers", "Our Special"].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 rounded" />
                {previewImg && <img src={previewImg} alt="preview" className="w-32 h-32 object-cover rounded" />}

                <button
                  onClick={handleAddItem}
                  className="bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition"
                >
                  Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer MenuPopup */}
      <AnimatePresence>
        {showMenuPopup && <MenuPopup onClose={() => setShowMenuPopup(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default Menu;
