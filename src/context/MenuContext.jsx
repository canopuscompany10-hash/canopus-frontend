import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch menu items
  const fetchMenuItems = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(`/menu?page=${pageNum}`);
      setMenuItems(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories (only once)
  const fetchCategories = async () => {
    try {
      const res = await AxiosInstance.get("/menu/categories");
      setCategories(res.data.map((c) => c.name));
    } catch (err) {
      console.error(err);
    }
  };

  // Menu item CRUD
  const addMenuItem = async (data) => {
    if (!data.image) throw new Error("Image is required");
    await AxiosInstance.post("/menu", data);
    await fetchMenuItems(1); // reset to page 1 after adding
    setPage(1);
  };

  const updateMenuItem = async (id, data) => {
    if (!data.image) throw new Error("Image is required");
    await AxiosInstance.put(`/menu/${id}`, data);
    await fetchMenuItems(page); // stay on current page
  };

  const deleteMenuItem = async (id) => {
    await AxiosInstance.delete(`/menu/${id}`);
    // If deleting last item on last page, go back one page
    if (menuItems.length === 1 && page > 1) setPage(page - 1);
    else fetchMenuItems(page);
  };

  // Category CRUD
  const createCategory = async (name) => {
    if (!name.trim()) return;
    await AxiosInstance.post("/menu/categories", { name });
    setCategories((prev) => [...prev, name]);
  };

  const deleteCategory = async (name) => {
    await AxiosInstance.delete(`/menu/categories/${name}`);
    setCategories((prev) => prev.filter((c) => c !== name));
    fetchMenuItems(1);
    setPage(1);
  };

  // Initial load
  useEffect(() => {
    fetchMenuItems(page);
  }, [page]);

  useEffect(() => {
    fetchCategories(); // only once
  }, []);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        categories,
        loading,
        error,
        page,
        totalPages,
        setPage,
        fetchMenuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        createCategory,
        deleteCategory,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContext;
