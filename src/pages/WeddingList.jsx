import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import WeddingContext from "../context/WeddingContext";
import AddWedding from "../components/AddWedding";

function WeddingList() {
  const { weddings, fetchWeddings, deleteWedding, loading } = useContext(WeddingContext);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeddings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-24">
      {/* Header */}
      <div className="flex justify-center items-center mb-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 bg-gray-200 text-gray-800 px-4 py-2 rounded-full shadow hover:bg-gray-300 transition flex items-center gap-2"
        >
          <FaArrowLeft /> Go Back
        </button>
        <h1 className="text-4xl font-extrabold text-red-500 tracking-wide text-center">
          Weddings
        </h1>
        <button
          onClick={() => setShowPopup(true)}
          className="absolute right-0 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-600 transition-all transform hover:scale-105"
        >
          + Add Wedding
        </button>
      </div>

      {/* Wedding Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : weddings.length === 0 ? (
        <p className="text-center text-gray-500 italic">No weddings added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {weddings.map((w) => (
            <div
              key={w._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <img
                src={w.image}
                alt={w.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <h2 className="font-bold text-lg text-red-500 mb-2 truncate">{w.title}</h2>
                <p className="text-gray-700 text-sm line-clamp-3">{w.description}</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this wedding?"))
                    deleteWedding(w._id);
                }}
                className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-red-600 transition-all"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Wedding Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden"
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
              >
                <FaTimes />
              </button>
              <AddWedding onClose={() => setShowPopup(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WeddingList;
