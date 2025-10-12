import { createContext, useState, useEffect } from "react";
import axios from "axios";
import AxiosInstance from "../lib/axios";

const WeddingContext = createContext();

export const WeddingProvider = ({ children }) => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all weddings
  const fetchWeddings = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("weddings");
      setWeddings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setWeddings([]); 
    } finally {
      setLoading(false);
    }
  };

  // Add a new wedding
  const addWedding = async (data) => {
    try {
      const res = await AxiosInstance.post("weddings", data);
      setWeddings((prev) => [res.data, ...prev]); 
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a wedding
  const deleteWedding = async (id) => {
    try {
      await AxiosInstance.delete(`weddings/${id}`);
      setWeddings((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WeddingContext.Provider
      value={{ weddings, fetchWeddings, addWedding, deleteWedding, loading }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export default WeddingContext;
