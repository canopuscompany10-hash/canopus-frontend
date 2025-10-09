import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Fetch menu items from backend
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/menu"); // match backend route
      setMenuItems(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Fetch menu items failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new menu item
  const addMenuItem = async (itemData) => {
    try {
      await AxiosInstance.post("/menu", itemData); // match backend
      await fetchMenuItems(); // refresh list
      console.log("Menu item added");
    } catch (err) {
      console.error("Add menu item failed:", err);
      throw err;
    }
  };

  // Update menu item
  const updateMenuItem = async (id, updatedData) => {
    try {
      await AxiosInstance.put(`/menu/${id}`, updatedData);
      await fetchMenuItems();
      console.log("Menu item updated");
    } catch (err) {
      console.error("Update menu item failed:", err);
      throw err;
    }
  };

  // Delete menu item
  const deleteMenuItem = async (id) => {
    try {
      await AxiosInstance.delete(`/menu/${id}`);
      await fetchMenuItems();
      console.log("Menu item deleted");
    } catch (err) {
      console.error("Delete menu item failed:", err);
      throw err;
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        error,
        fetchMenuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
