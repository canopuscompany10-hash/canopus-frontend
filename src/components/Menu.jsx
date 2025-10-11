// Menu.js
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

  const itemsPerPage = 20; // 4 cols x 5 rows

  useEffect(() => {
    fetchMenuItems(page, itemsPerPage); // backend should support limit parameter
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

  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
    <div
      id="menu"
      className="min-h-screen py-16 px-6 md:px-20 bg-red-500 text-white relative overflow-hidden"
    >
      {/* Header */}
      <div className="relative mb-8">
        <h2 className="kaushan-script-regular text-3xl md:text-4xl text-center">
          Catering Menu
        </h2>

        {(role === "admin" || role === "superadmin") && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddPopup(true)}
            className="absolute top-0 right-0 bg-white text-red-500 font-semibold px-4 py-2 rounded-full shadow-md"
          >
            + Add Item
          </motion.button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-3 mb-6 items-center">
        {["All", ...categories.filter((cat) => cat !== "All")].map((cat) => (
          <div key={cat} className="relative flex items-center">
            <button
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 rounded-full font-semibold border-2 text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-white text-red-500 border-white"
                  : "border-white text-white hover:bg-white hover:text-red-500"
              }`}
            >
              {cat}
            </button>

            {(role === "admin" || role === "superadmin") &&
              !["All"].includes(cat) && (
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex justify-center items-center text-xs hover:bg-gray-800 transition"
                >
                  <FaTrash />
                </button>
              )}
          </div>
        ))}

        {(role === "admin" || role === "superadmin") && (
          <div className="ml-2 flex gap-2 items-center">
            <input
              type="text"
              placeholder="New"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-1 rounded text-black text-sm"
            />
            <button
              onClick={handleAddCategory}
              className="bg-white text-red-500 px-2 py-1 rounded hover:bg-gray-100 transition text-sm"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      {loading ? (
        <p className="text-center text-white">Loading menu items...</p>
      ) : paginatedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-3 p-3 border-b border-dotted border-white transition-all text-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  <p className="text-white/90 text-xs">{item.description}</p>
                </div>
              </div>
              <span className="text-white font-bold text-sm">${item.price}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/80 text-sm italic">
          No items listed in <span className="font-semibold">{activeCategory}</span>.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="bg-white text-red-500 px-3 py-1 rounded-full disabled:opacity-50 hover:bg-white/90 transition text-sm"
        >
          Prev
        </button>
        <span className="text-white font-semibold text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="bg-white text-red-500 px-3 py-1 rounded-full disabled:opacity-50 hover:bg-white/90 transition text-sm"
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
