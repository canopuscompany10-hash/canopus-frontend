import React, { useRef, useContext, useState } from "react";
import { FaTimes, FaCalendarAlt, FaClock, FaUsers, FaMoneyBill } from "react-icons/fa";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

function AddWork({ isOpen, closeModal }) {
  const { addWork } = useContext(WorkContext);
  const { allUsers = [] } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const titleRef = useRef();
  const descriptionRef = useRef();
  const dueDateRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const totalMembersRef = useRef();
  const budgetRef = useRef();
  const selectedStaffRef = useRef(new Set());

  const staffList = allUsers.filter((user) => user.role === "staff");

  const handleCheckboxChange = (e) => {
    const userId = e.target.value;
    if (e.target.checked) {
      selectedStaffRef.current.add(userId);
    } else {
      selectedStaffRef.current.delete(userId);
    }
  };

  const combineDateAndTime = (date, time) => {
    if (!date || !time) return null;
    return new Date(`${date}T${time}:00`).toISOString();
  };

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const resetForm = () => {
    titleRef.current.value = "";
    descriptionRef.current.value = "";
    dueDateRef.current.value = "";
    startTimeRef.current.value = "";
    endTimeRef.current.value = "";
    totalMembersRef.current.value = "";
    budgetRef.current.value = "";
    selectedStaffRef.current.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Capitalize first letter
    const title = capitalizeFirstLetter(titleRef.current.value.trim());
    const description = capitalizeFirstLetter(descriptionRef.current.value.trim());
    const dueDate = dueDateRef.current.value;
    const startTime = startTimeRef.current.value;
    const endTime = endTimeRef.current.value;
    const totalMembers = parseInt(totalMembersRef.current.value);
    const budget = parseFloat(budgetRef.current.value);
    const selectedStaff = Array.from(selectedStaffRef.current);

    // Validation
    if (!title || !dueDate || !totalMembers || totalMembers <= 0 || budget <= 0) {
      toast.error("Please fill all required fields correctly.");
      return;
    }
    if (selectedStaff.length === 0) {
      toast.error("Please assign at least one staff member.");
      return;
    }
    if (startTime && endTime && startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    setLoading(true);

    const newWork = {
      title,
      description,
      dueDate,
      startTime: combineDateAndTime(dueDate, startTime),
      endTime: combineDateAndTime(dueDate, endTime),
      totalMembers,
      budget,
      assignedTo: selectedStaff.map((id) => ({ user: { _id: id } })),
    };

    try {
      await addWork(newWork); // Await for async action if addWork returns a promise
      toast.success("Work added successfully!");
      closeModal();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add work.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h3 className="text-xl font-bold text-gray-800">Add New Work</h3>
          <button
            onClick={() => {
              closeModal();
              resetForm();
            }}
            className="text-gray-600 hover:text-red-600 transition"
            aria-label="Close modal"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              ref={titleRef}
              placeholder="Enter work title"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              ref={descriptionRef}
              placeholder="Enter work description"
              rows={3}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none resize-none"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-700 mb-1">Due Date *</label>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <input
                type="date"
                ref={dueDateRef}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col relative">
              <label className="font-semibold text-gray-700 mb-1">Start Time</label>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <input
                  type="time"
                  ref={startTimeRef}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col relative">
              <label className="font-semibold text-gray-700 mb-1">End Time</label>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <input
                  type="time"
                  ref={endTimeRef}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Total Members */}
          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-700 mb-1">Total Members *</label>
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400" />
              <input
                type="number"
                min={1}
                ref={totalMembersRef}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col relative">
            <label className="font-semibold text-gray-700 mb-1">Budget *</label>
            <div className="flex items-center gap-2">
              <FaMoneyBill className="text-gray-400" />
              <input
                type="number"
                min={0}
                ref={budgetRef}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Staff Assignment */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Assign Staff *</label>
            {staffList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No staff available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                {staffList.map((staff) => (
                  <label
                    key={staff._id}
                    className="flex items-center gap-2 text-sm cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      value={staff._id}
                      onChange={handleCheckboxChange}
                      className="cursor-pointer"
                    />
                    {staff.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition flex justify-center items-center gap-2`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                Adding...
              </>
            ) : (
              "Add Work"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddWork;
