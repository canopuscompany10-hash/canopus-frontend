import React, { useContext, useState, useEffect, useRef } from "react";
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

  const itemsPerPage = 16;

  const menuRef = useRef(null); // 👈 ref for scrolling

  // Filter items by category
  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  // Compute pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    setPage(1); // reset page when category changes
  }, [activeCategory]);

  // Scroll to top of menu on page change
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [page]);

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return alert("Enter category name!");
    try {
      await createCategory(newCategory);
      setActiveCategory(newCategory);
      setNewCategory("");
    } catch {
      alert("Failed to add category");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete "${cat}" category?`)) return;
    try {
      await deleteCategory(cat);
      if (activeCategory === cat) setActiveCategory("All");
    } catch {
      alert("Failed to delete category");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await deleteMenuItem(id);
    } catch {
      alert("Failed to delete menu item");
    }
  };

  return (
    <div id="menu"
      ref={menuRef}
      className="min-h-screen py-12 px-4 md:px-16 bg-red-500 text-white relative overflow-auto"
    >
      {/* Header */}
      <div className="relative mb-8">
        <h2 className="kaushan-script-regular text-3xl md:text-5xl text-center">
          Catering Menu
        </h2>
        {(role === "admin" || role === "superadmin") && (
          <div className="absolute top-0 right-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddPopup(true)}
              className="bg-white text-red-500 font-semibold px-3 py-1 rounded-full shadow-md text-sm"
            >
              + Add
            </motion.button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 items-center text-sm">
        {["All", ...categories.filter((cat) => cat !== "All")].map((cat) => (
          <div key={cat} className="relative flex items-center">
            <button
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full font-semibold border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-white text-red-500 border-white"
                  : "border-white text-white hover:bg-white hover:text-red-500"
              }`}
            >
              {cat}
            </button>
            {(role === "admin" || role === "superadmin") && !["All"].includes(cat) && (
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
          <div className="flex gap-1 items-center">
            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-1 rounded text-black text-xs"
            />
            <button
              onClick={handleAddCategory}
              className="bg-white text-red-500 px-2 py-1 rounded hover:bg-gray-100 transition text-xs"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      {loading ? (
        <p className="text-center text-white text-sm">Loading menu items...</p>
      ) : paginatedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto text-sm">
          {paginatedItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between gap-2 p-3 border-b border-dotted border-white transition-all relative"
            >
              <div className="flex items-center gap-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <h3 className="font-semibold">{item.name}</h3>
              </div>
              <span className="font-bold">${item.price}</span>

              {/* Delete button for admin */}
              {(role === "admin" || role === "superadmin") && (
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="absolute -top-1 -right-1 bg-black text-white rounded-full w-4 h-4 flex justify-center items-center text-xs hover:bg-gray-800 transition"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white/80 text-sm italic">
          No items listed in <span className="font-semibold">{activeCategory}</span>.
        </p>
      )}

      {/* Pagination */}
      {paginatedItems.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 text-sm">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="bg-white text-red-500 px-3 py-1 rounded-full disabled:opacity-50 hover:bg-white/90 transition"
          >
            Prev
          </button>
          <span className="text-white font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="bg-white text-red-500 px-3 py-1 rounded-full disabled:opacity-50 hover:bg-white/90 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Item Popup */}
      <AnimatePresence>
        {showAddPopup && (role === "admin" || role === "superadmin") && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-auto">
            <div className="bg-white text-red-500 rounded-2xl p-4 w-full max-w-sm shadow-2xl relative">
              <h2 className="text-xl font-bold mb-3 text-center text-red-500">
                Add Menu Item
              </h2>
              <button
                onClick={() => setShowAddPopup(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
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
