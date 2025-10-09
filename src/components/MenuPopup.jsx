import React, { useContext, useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import MenuContext from "../context/MenuContext";

function MenuPopup({ onClose }) {
  const { menuItems, loading, error } = useContext(MenuContext);

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (menuItems && menuItems.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(menuItems.map((item) => item.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-start md:items-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-6 md:p-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          Select Items
        </h2>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeCategory === cat
                    ? "bg-red-500 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading/Error */}
        {loading ? (
          <p className="text-center text-gray-500">Loading menu items...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">No items available</p>
        ) : (
          <ul className="max-h-[60vh] overflow-y-auto space-y-2 border rounded-lg p-3">
            {filteredItems.map((item) => {
              // const selected = selectedItems.find((i) => i._id === item._id);
              return (
                <li
                  key={item._id}
                  // onClick={() => toggleSelectItem(item)}
                  // className={`flex justify-between items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-red-50 transition ${
                  //   selected ? "bg-red-100 border border-red-400" : ""
                  // }`}
                >
                  <span>{item.name}</span>
                  {/* {selected && <span className="text-red-500 font-bold">✓</span>} */}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MenuPopup;
