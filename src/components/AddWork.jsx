import React, { useRef, useContext } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaMoneyBill,
} from "react-icons/fa";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";

function AddWork({ isOpen, closeModal }) {
  const { addWork } = useContext(WorkContext);
  const { allUsers = [] } = useContext(UserContext);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = titleRef.current.value.trim();
    const description = descriptionRef.current.value.trim();
    const dueDate = dueDateRef.current.value;
    const startTime = startTimeRef.current.value;
    const endTime = endTimeRef.current.value;
    const totalMembers = parseInt(totalMembersRef.current.value);
    const budget = parseFloat(budgetRef.current.value);
    const selectedStaff = Array.from(selectedStaffRef.current);

    if (
      !title ||
      !dueDate ||
      !totalMembers ||
      totalMembers <= 0 ||
      budget <= 0
    ) {
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

    addWork(newWork);
    toast.success("Work added successfully!");
    closeModal();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add New Work</h3>
          <button
            onClick={() => {
              closeModal();
              resetForm();
            }}
            className="text-gray-600 hover:text-gray-900 transition"
            aria-label="Close modal"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              id="title"
              ref={titleRef}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2"
              placeholder=" "
            />
            <label
              htmlFor="title"
              className="absolute left-0 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Title *
            </label>
          </div>

          {/* Description */}
          <div className="relative">
            <textarea
              id="description"
              ref={descriptionRef}
              rows={3}
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 resize-none"
              placeholder=" "
            />
            <label
              htmlFor="description"
              className="absolute left-0 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Description
            </label>
          </div>

          {/* Due Date */}
          <div className="relative">
            <FaCalendarAlt className="absolute top-3 left-2 text-gray-400 pointer-events-none" />
            <input
              type="date"
              id="dueDate"
              ref={dueDateRef}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 pl-8"
            />
            <label
              htmlFor="dueDate"
              className="absolute left-8 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Due Date *
            </label>
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <FaClock className="absolute top-3 left-2 text-gray-400 pointer-events-none" />
              <input
                type="time"
                id="startTime"
                ref={startTimeRef}
                className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 pl-8"
              />
              <label
                htmlFor="startTime"
                className="absolute left-8 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                Start Time
              </label>
            </div>
            <div className="relative">
              <FaClock className="absolute top-3 left-2 text-gray-400 pointer-events-none" />
              <input
                type="time"
                id="endTime"
                ref={endTimeRef}
                className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 pl-8"
              />
              <label
                htmlFor="endTime"
                className="absolute left-8 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
              >
                End Time
              </label>
            </div>
          </div>

          {/* Total Members */}
          <div className="relative">
            <FaUsers className="absolute top-3 left-2 text-gray-400 pointer-events-none" />
            <input
              type="number"
              id="totalMembers"
              ref={totalMembersRef}
              min={1}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 pl-8"
            />
            <label
              htmlFor="totalMembers"
              className="absolute left-8 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Total Members *
            </label>
          </div>

          {/* Budget */}
          <div className="relative">
            <FaMoneyBill className="absolute top-3 left-2 text-gray-400 pointer-events-none" />
            <input
              type="number"
              id="budget"
              ref={budgetRef}
              min={0}
              required
              className="peer w-full border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 pl-8"
            />
            <label
              htmlFor="budget"
              className="absolute left-8 -top-5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              Budget *
            </label>
          </div>

          {/* Staff Assignment */}
          {/* Staff Assignment */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Assign to Staff <span className="text-red-500">*</span>:
            </label>
            {staffList.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No staff found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded p-2">
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
                    <span>{staff.name}</span> {/* ✅ Only showing name */}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add Work
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddWork;
