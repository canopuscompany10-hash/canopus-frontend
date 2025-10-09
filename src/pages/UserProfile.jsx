import React, { useContext, useState, useEffect } from "react";
import {
  FaTrashAlt,
  FaPlus,
  FaCalendarAlt,
  FaEdit,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../context/UserContext";

function UserProfile() {
  const navigate = useNavigate();
  const { user, toggleAttendance, logoutUser, updateUser } =
    useContext(UserContext);
  const { bookings, fetchBookings, handleCancelRequest } =
    useContext(BookingContext);

  const [isEditing, setIsEditing] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [image, setImage] = useState(user?.image || "");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [localBookings, setLocalBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bookings safely
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchBookings()
        .catch((err) => {
          console.error("Failed to fetch bookings:", err);
          toast.error("Failed to fetch bookings!");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // Sync local state
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setImage(user?.image || "");
  }, [user]);

  // Ensure localBookings is always an array
  useEffect(() => {
    setLocalBookings(Array.isArray(bookings) ? bookings : []);
  }, [bookings]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );

  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser({ name, email, image });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const confirmCancel = (booking) => {
    setSelectedBooking(booking);
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedBooking) return;
    setLocalBookings((prev) =>
      prev.map((b) =>
        b._id === selectedBooking._id ? { ...b, cancelRequest: true } : b
      )
    );
    handleCancelRequest(selectedBooking._id)
      .then(() => toast.success("Cancellation request sent!"))
      .catch(() => toast.error("Failed to send cancellation request"));
    setShowConfirm(false);
    setSelectedBooking(null);
  };

  const handleCloseConfirm = () => {
    setShowConfirm(false);
    setSelectedBooking(null);
  };

  // Filter bookings safely: admin sees all, others see only theirs
  const displayBookings = Array.isArray(localBookings)
    ? user.role === "admin"
      ? [...localBookings].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : localBookings.filter((b) => b.status !== "cancelled")
    : [];

  // Pagination slice
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentSlice = displayBookings.slice(start, end);
  const totalPages = Math.ceil(displayBookings.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto pt-24 px-4 md:px-8 space-y-10">
        {/* --- User Info Card --- */}
        <div className="bg-white shadow-md rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-28 h-28 rounded-full border-4 border-red-500"
                />
              ) : (
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-red-500 text-white text-5xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full border cursor-pointer hover:bg-gray-100">
                  <FaUpload className="text-red-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded px-3 py-1 focus:ring focus:ring-orange-300"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-3 py-1 focus:ring focus:ring-orange-300"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold">{name}</h2>
                  <p className="text-gray-600">{email}</p>
                </>
              )}
              {user.role !== "customer" && (
                <>
                  <p className="text-gray-500 capitalize">Role: {user.role}</p>
                  <p className="text-gray-500">
                    Attendance:{" "}
                    <span
                      className={`font-semibold ${
                        user.attendance ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.attendance ? "Present" : "Absent"}
                    </span>
                    <button
                      onClick={toggleAttendance}
                      className="ml-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    >
                      Toggle
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4 md:mt-0">
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-5 py-2 rounded-lg hover:bg-gray-500 flex items-center gap-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}
            </div>
            {["admin", "manager", "staff"].includes(user?.role) && (
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* --- Loader --- */}
        {loading && (
          <div className="flex justify-center items-center h-32 text-gray-600">
            Loading bookings...
          </div>
        )}

        {!loading && (
          <>
            <BookingTable
              title="Bookings"
              bookings={currentSlice}
              cancelAction={confirmCancel}
              showCancel={user.role !== "admin"}
              currentPage={currentPage}
              setPage={setCurrentPage}
              totalPages={totalPages}
            />
          </>
        )}

        <div className="mt-4">
          <button
            onClick={() => setShowBookingForm(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition font-semibold"
          >
            <FaPlus /> Make New Booking
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Cancel Booking
            </h2>
            <p className="mb-6">
              Are you sure you want to request cancellation for:{" "}
              <span className="font-bold">{selectedBooking?.event}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Request Cancel
              </button>
              <button
                onClick={handleCloseConfirm}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showBookingForm && (
        <BookingForm onClose={() => setShowBookingForm(false)} />
      )}
    </div>
  );
}

// BookingTable component
const BookingTable = ({
  title,
  bookings,
  cancelAction,
  showCancel = true,
  currentPage,
  setPage,
  totalPages,
}) => (
  <div className="bg-white shadow-md rounded-xl p-6 mt-6">
    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
      <FaCalendarAlt /> {title}
    </h3>
    {!bookings || bookings.length === 0 ? (
      <p className="text-gray-500">No bookings.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 border-b text-left">Event</th>
              <th className="px-4 py-3 border-b text-left">Date</th>
              <th className="px-4 py-3 border-b text-left">Guests</th>
              {showCancel && (
                <th className="px-4 py-3 border-b text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b._id}
                className="hover:bg-gray-100 transition-all duration-150"
              >
                <td className="px-4 py-3 border-b">{b.event}</td>
                <td className="px-4 py-3 border-b">
                  {new Date(b.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-b">{b.guests}</td>
                {showCancel && (
                  <td className="px-4 py-3 border-b text-center">
                    {b.cancelRequest ? (
                      <span className="text-yellow-600 font-semibold text-xs">
                        Request Sent
                      </span>
                    ) : (
                      <button
                        onClick={() => cancelAction(b)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {/* Pagination */}
    {totalPages > 1 && currentPage && setPage && (
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default UserProfile;
