import React, { useRef, useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
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

    const title = capitalizeFirstLetter(titleRef.current.value.trim());
    const description = capitalizeFirstLetter(descriptionRef.current.value.trim());
    const dueDate = dueDateRef.current.value;
    const startTime = startTimeRef.current.value;
    const endTime = endTimeRef.current.value;
    const totalMembers = parseInt(totalMembersRef.current.value);
    const budget = parseFloat(budgetRef.current.value);
    const selectedStaff = Array.from(selectedStaffRef.current);

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
      await addWork(newWork);
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
    <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        
        <button
          onClick={() => {
            closeModal();
            resetForm();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
          aria-label="Close modal"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800 border-b-2 border-red-600 pb-1">
            Create Works
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">Title *</label>
            <input
              type="text"
              ref={titleRef}
              placeholder="Enter work title"
              className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm placeholder-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">Description</label>
            <textarea
              ref={descriptionRef}
              placeholder="Enter description"
              rows={3}
              className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm placeholder-gray-400 resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">Due Date *</label>
            <input
              type="date"
              ref={dueDateRef}
              className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm"
              required
            />
          </div>

          {/* Start & End Time */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-xs uppercase text-gray-500 mb-1 block">Start Time</label>
              <input
                type="time"
                ref={startTimeRef}
                className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="text-xs uppercase text-gray-500 mb-1 block">End Time</label>
              <input
                type="time"
                ref={endTimeRef}
                className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm"
              />
            </div>
          </div>

          {/* Total Members */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">Total Members *</label>
            <input
              type="number"
              min={1}
              ref={totalMembersRef}
              className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm"
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-1 block">Budget *</label>
            <input
              type="number"
              min={0}
              ref={budgetRef}
              className="w-full border-b border-gray-300 focus:border-red-600 outline-none py-2 text-sm"
              required
            />
          </div>

          {/* Staff Assignment */}
          <div>
            <label className="text-xs uppercase text-gray-500 mb-2 block">Assign Staff *</label>
            {staffList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No staff available.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                {staffList.map((staff) => (
                  <label key={staff._id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      value={staff._id}
                      onChange={handleCheckboxChange}
                      className="accent-red-600"
                    />
                    {staff.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            } transition flex justify-center items-center gap-2`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
                Adding...
              </>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddWork;
