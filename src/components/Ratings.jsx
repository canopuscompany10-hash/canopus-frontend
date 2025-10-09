import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserContext from "../context/UserContext";

const initialRatings = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    comment:
      "Excellent service! The team was very professional and attentive. I would definitely recommend them to friends and family.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    hidden: false,
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    comment:
      "Very good experience overall. Some small delays, but the staff handled everything gracefully.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    hidden: false,
  },
  {
    id: 3,
    name: "Alice Johnson",
    rating: 5,
    comment:
      "Highly recommend! The attention to detail was amazing, and the quality exceeded my expectations.",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    hidden: false,
  },
];

function Ratings() {
  const { user, isAdmin } = useContext(UserContext);
  const [ratings, setRatings] = useState(initialRatings);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  // Add Review
  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment) return alert("Fill all fields!");
    const newId = ratings.length
      ? Math.max(...ratings.map((r) => r.id)) + 1
      : 1;
    setRatings([
      ...ratings,
      {
        ...newReview,
        id: newId,
        image: "https://randomuser.me/api/portraits/lego/1.jpg",
        hidden: false,
      },
    ]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setShowAddPopup(false);
  };

  // Admin delete or hide
  const handleDelete = (id) => setRatings(ratings.filter((r) => r.id !== id));
  const handleHide = (id) =>
    setRatings(
      ratings.map((r) => (r.id === id ? { ...r, hidden: !r.hidden } : r))
    );

  return (
    <div id="reviews" className="overflow-hidden w-full py-16 bg-red-500 relative px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          What Our Customers Say
        </h2>
        <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
          We value our customers and always strive to provide the best service.
          Here's what some of our happy clients have to say.
        </p>
      </div>

      {/* Add Review Button for User */}
      {user && !isAdmin && (
        <button
          onClick={() => setShowAddPopup(true)}
          className="absolute top-20 right-6 bg-white text-red-500 px-4 py-2 rounded-full font-semibold hover:bg-white/90"
        >
          + Add Review
        </button>
      )}

      {/* Ratings Scroll */}
      <motion.div
        className="flex gap-8 px-4"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {ratings
          .filter((r) => !r.hidden)
          .concat(ratings.filter((r) => !r.hidden)) // loop for scroll
          .map((r) => (
            <div
              key={r.id + Math.random()}
              className="min-w-[320px] md:min-w-[360px] bg-white p-6 rounded-3xl shadow-lg flex flex-col gap-4 relative"
            >
              <div className="flex items-center gap-4">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-14 h-14 rounded-full border-2 border-red-500"
                />
                <div>
                  <h4 className="font-bold text-xl md:text-2xl">{r.name}</h4>
                  <div className="flex gap-1 text-yellow-400 mt-1">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {r.comment}
              </p>

              {/* Admin Controls */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handleHide(r.id)}
                    className="px-2 py-1 text-xs bg-yellow-400 rounded hover:bg-yellow-500"
                  >
                    {r.hidden ? "Unhide" : "Hide"}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
      </motion.div>

      {/* Add Review Popup */}
      <AnimatePresence>
        {showAddPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white text-red-500 rounded-2xl p-6 w-96 shadow-2xl relative"
            >
              <h3 className="text-2xl font-bold mb-5 text-center">
                Add Review
              </h3>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-400"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                />
                <textarea
                  placeholder="Your Review"
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-400"
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                />
                <label className="text-sm font-semibold text-gray-700">
                  Rating
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="border border-gray-300 rounded p-2 focus:ring-2 focus:ring-red-400"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setShowAddPopup(false)}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                >
                  Add
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Ratings;
