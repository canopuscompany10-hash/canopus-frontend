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
  // const limit = 16;

  // Fetch menu items
  const fetchMenuItems = async (pageNum = page) => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(`/menu?page=${pageNum}`);
      // &limit=${limit}
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

  // Fetch categories
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
    await fetchMenuItems();
  };

  const updateMenuItem = async (id, data) => {
    if (!data.image) throw new Error("Image is required");
    await AxiosInstance.put(`/menu/${id}`, data);
    await fetchMenuItems();
  };

  const deleteMenuItem = async (id) => {
    await AxiosInstance.delete(`/menu/${id}`);
    await fetchMenuItems();
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
  };

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, [page]);

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
