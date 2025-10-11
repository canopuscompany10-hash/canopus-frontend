import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import MenuContext from "../context/MenuContext";
import UserContext from "../context/UserContext";
import MenuPopup from "./MenuPopup";

function Menu() {
  const {
    menuItems,
    loading,
    page,
    totalPages,
    setPage,
    fetchMenuItems,
    categories,
    createCategory,
    deleteCategory,
    deleteMenuItem,
  } = useContext(MenuContext);

  const { user } = useContext(UserContext);
  const role = user?.role || "customer";

  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchMenuItems(page);
  }, [page]);

  useEffect(() => {
    if (!categories.includes("All")) {
      setActiveCategory(categories[0] || "All");
    } else {
      setActiveCategory("All");
    }
  }, [categories]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Please enter a category name!");
    try {
      await createCategory(newCategory);
      setActiveCategory(newCategory);
      setNewCategory("");
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (
      window.confirm(
        `Are you sure you want to delete the category "${cat}"? This will also delete all items in it.`
      )
    ) {
      try {
        await deleteCategory(cat);
        const itemsInCategory = menuItems.filter((item) => item.category === cat);
        for (let item of itemsInCategory) {
          await deleteMenuItem(item._id);
        }
        if (activeCategory === cat) setActiveCategory("All");
      } catch (err) {
        console.error("Failed to delete category or items:", err);
        alert("Failed to delete category or its items");
      }
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 md:px-20 bg-red-500 text-white relative overflow-hidden">
      {/* Header */}
      <div className="relative mb-10">
        <h2 className="kaushan-script-regular text-4xl md:text-5xl text-center">
          Catering Menu
        </h2>

        {/* Only admin and super-admin can add items */}
        <div className="absolute top-0 right-0">
          {(role === "admin" || role === "superadmin") && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPopup(true)}
              className="bg-white text-red-500 font-semibold px-4 py-2 rounded-full shadow-md"
            >
              + Add Item
            </motion.button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 items-center">
        {["All", ...categories.filter((cat) => cat !== "All")].map((cat) => (
          <div key={cat} className="relative flex items-center">
            <button
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-white text-red-500 border-white"
                  : "border-white text-white hover:bg-white hover:text-red-500"
              }`}
            >
              {cat}
            </button>

            {/* Only admin/super-admin can delete category */}
            {(role === "admin" || role === "superadmin") && !["All"].includes(cat) && (
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex justify-center items-center text-xs hover:bg-gray-800 transition"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}

        {/* Add new category input only for admin/super-admin */}
        {(role === "admin" || role === "superadmin") && (
          <div className="ml-4 flex gap-2 items-center">
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded text-black"
            />
            <button
              onClick={handleAddCategory}
              className="bg-white text-red-500 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      {loading ? (
        <p className="text-center text-white">Loading menu items...</p>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-4 p-4 border-b border-dotted border-white transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
                </div>
              </div>
              <span className="text-white font-bold">${item.price}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/80 text-lg italic">
          No items listed in <span className="font-semibold">{activeCategory}</span>.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-white text-red-500 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-white/90 transition"
        >
          Prev
        </button>
        <span className="text-white font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-white text-red-500 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-white/90 transition"
        >
          Next
        </button>
      </div>

      {/* Add Item Popup */}
      <AnimatePresence>
        {showAddPopup && (role === "admin" || role === "superadmin") && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-auto">
            <div className="bg-white text-red-500 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
              <h2 className="text-2xl font-bold mb-4 text-center text-red-500">
                Add Menu Item
              </h2>
              <button
                onClick={() => setShowAddPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
              <MenuPopup onClose={() => setShowAddPopup(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Menu;
