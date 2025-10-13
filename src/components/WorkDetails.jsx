import { useContext, useState, useEffect } from "react";
import { FaTimes, FaUser, FaEdit, FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";
import PaymentPopup from "./PaymentPopup";

function WorkDetails({ work, onClose }) {
  const { deleteWork, updateStaffPayment, updateWork } = useContext(WorkContext);
  const { user, allUsers = [] } = useContext(UserContext);

  const [staffData, setStaffData] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentWork, setCurrentWork] = useState(work);
  const [editableWork, setEditableWork] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState(new Set());

  useEffect(() => {
    if (work) {
      setStaffData(work.assignedTo || []);
      setCurrentWork(work);
      setEditableWork({
        title: work.title,
        description: work.description,
        dueDate: work.dueDate,
        totalMembers: work.totalMembers || work.assignedTo?.length || 0,
        budget: work.budget || 0,
        status: work.status || "pending",
        overallPaymentStatus: work.overallPaymentStatus || "pending",
      });
      setSelectedStaffIds(new Set());
    }
  }, [work]);

  if (!work) return null;

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  const availableStaff = allUsers.filter(
    (u) => u.role === "staff" && !staffData.some((s) => s.user?._id === u._id)
  );

  const calcOverallPaymentStatus = (updatedStaff) =>
    updatedStaff.every((s) => s.paymentStatus === "completed")
      ? "completed"
      : "pending";

  const handleStaffUpdate = async (staffId, data) => {
    try {
      await updateStaffPayment(work._id, staffId, data);
      const updatedStaff = staffData.map((s) =>
        s.user?._id === staffId ? { ...s, ...data } : s
      );
      const overallPaymentStatus = calcOverallPaymentStatus(updatedStaff);
      const newStatus =
        overallPaymentStatus === "completed"
          ? "completed"
          : currentWork.status;

      await updateWork(work._id, { overallPaymentStatus, status: newStatus });

      setStaffData(updatedStaff);
      setCurrentWork({
        ...currentWork,
        assignedTo: updatedStaff,
        overallPaymentStatus,
        status: newStatus,
      });
      toast.success("Staff payment updated!");
    } catch (err) {
      toast.error("Failed to update staff payment");
      console.error(err);
    }
  };

  const handleWorkUpdate = async () => {
    try {
      const updatedData = {
        ...editableWork,
        budget: parseFloat(editableWork.budget || 0),
        totalMembers: parseInt(editableWork.totalMembers || 0),
      };
      await updateWork(work._id, updatedData);
      setCurrentWork({ ...currentWork, ...updatedData });
      toast.success("Work updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update work");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWork(work._id);
      toast.success("Work deleted successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to delete work");
      console.error(err);
    }
  };

  const toggleStaffSelection = (id) => {
    const newSet = new Set(selectedStaffIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedStaffIds(newSet);
  };

  const handleAddStaff = async () => {
    if (selectedStaffIds.size === 0) {
      toast.error("Select at least one staff to add.");
      return;
    }

    const newStaff = Array.from(selectedStaffIds).map((id) => ({
      user: { _id: id },
      amountPaid: 0,
      paymentStatus: "pending",
      violations: [],
    }));

    const updatedStaffData = [...staffData, ...newStaff];
    try {
      await updateWork(work._id, { assignedTo: updatedStaffData });
      setStaffData(updatedStaffData);
      toast.success("Staff added successfully!");
      setIsAddStaffOpen(false);
    } catch (err) {
      toast.error("Failed to add staff");
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-[90vh]  ">
      
      {/* Go Back Button */}
    

      {/* Close Button */}
      {/* <button
        onClick={onClose}
        className="absolute top-3 right-3 text-2xl text-gray-600 hover:text-red-600 z-50"
      >
        <FaTimes />
      </button> */}

      {/* Wrapper: Work first, Staff second */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6  md:mt-0">
        {/* Work Details Panel */}
        <div className="flex-1 bg-white p-4 md:p-6 rounded-xl shadow-md border border-gray-200 h-fit md:h-[80vh] overflow-y-auto">
            <button
        onClick={onClose}
        className="  text-lg md:text-xl flex items-center gap-1 text-red-500 hover:text-red-700  pb-5"
      >
        <FaArrowLeft /> Go Back
      </button>
          <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">
            Work Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-gray-600 text-sm font-medium">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableWork.title}
                  onChange={(e) =>
                    setEditableWork({ ...editableWork, title: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p className="text-gray-800 break-words text-2xl">{currentWork.title}</p>
              )}
            </div>

            {/* Budget */}
            {isAdmin && (
              <div>
                <label className="block text-gray-600 text-sm font-medium">Budget</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editableWork.budget}
                    onChange={(e) =>
                      setEditableWork({ ...editableWork, budget: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-gray-800">₹{currentWork.budget}</p>
                )}
              </div>
            )}

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-600 text-sm font-medium">Description</label>
              {isEditing ? (
                <textarea
                  value={editableWork.description}
                  onChange={(e) =>
                    setEditableWork({ ...editableWork, description: e.target.value })
                  }
                  className="border p-2 rounded w-full h-24 resize-none"
                />
              ) : (
                <p className="text-gray-800 break-words">{currentWork.description}</p>
              )}
            </div>

            {/* Total Members */}
            <div>
              <label className="block text-gray-600 text-sm font-medium">Total Members</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editableWork.totalMembers}
                  onChange={(e) =>
                    setEditableWork({ ...editableWork, totalMembers: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              ) : (
                <p className="text-gray-800">{currentWork.totalMembers}</p>
              )}
            </div>

            {/* Status */}
          {/* Status */}
<div>
  <label className="block text-gray-600 text-sm font-medium">Status</label>
  {isEditing && isAdmin ? (
    <select
      value={editableWork.status}
      onChange={(e) =>
        setEditableWork({ ...editableWork, status: e.target.value })
      }
      className="border p-2 rounded w-full"
    >
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option> 
                               <option className="hidden" value="due">Due</option>

    </select>
  ) : (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
        currentWork.status === "completed"
          ? "bg-green-100 text-green-700"
          : currentWork.status === "in progress"
          ? "bg-yellow-100 text-yellow-700"
          : currentWork.status === "due"
          ?  "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {currentWork.status.charAt(0).toUpperCase() + currentWork.status.slice(1)}
    </span>
  )}
</div>


            {/* Payment Status */}
            {isAdmin && (
              <div>
                <label className="block text-gray-600 text-sm font-medium">
                  Payment Status
                </label>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    currentWork.overallPaymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {currentWork.overallPaymentStatus.charAt(0).toUpperCase() +
                    currentWork.overallPaymentStatus.slice(1)}
                </span>
              </div>
            )}
          </div>

          {/* Admin Buttons */}
          {isAdmin && (
            <div className="flex flex-wrap gap-3 mt-6">
              {isEditing ? (
                <button
                  onClick={handleWorkUpdate}
                  className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  <FaSave /> Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  <FaEdit /> Edit
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Staff Panel */}
        <div className="w-full md:w-1/3 flex flex-col gap-3 bg-white rounded-md p-4 md:p-5 overflow-y-auto shadow-sm h-fit md:h-[80vh]">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h2 className="text-lg md:text-xl font-bold text-gray-700">
              Staff ({staffData.length})
            </h2>
            {isAdmin && availableStaff.length > 0 && (
              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                <FaUser /> Add
              </button>
            )}
          </div>

          {staffData.length ? (
            <div className="flex flex-col gap-3">
              {staffData.map((s) => {
                const totalPenalty =
                  s.violations?.reduce((sum, v) => sum + (v.penalty || 0), 0) || 0;

                return (
                  <div
                    key={s.user?._id || s._id}
                    className="flex flex-col p-3 rounded-xl shadow-sm border bg-gray-50"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-500" />
                        <span className="font-medium text-gray-800 text-sm md:text-base">
                          {s.user?.name || "Unknown"}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">
                            ₹{s.amountPaid || 0}
                          </span>
                          <button
                            onClick={() => setEditingStaff(s)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </div>

                    {isAdmin && (
                      <div className="mt-2 text-xs md:text-sm text-gray-700 border-t pt-2">
                        {s.violations?.length ? (
                          s.violations.map((v, idx) => (
                            <p key={idx} className="text-red-500">
                              <span className="font-semibold">Violation:</span>{" "}
                              {v.reason} |{" "}
                              <span className="font-semibold">Penalty:</span> ₹
                              {v.penalty || 0}
                            </p>
                          ))
                        ) : (
                          <p>
                            <span className="font-semibold">Violation:</span> None |{" "}
                            <span className="font-semibold">Penalty:</span> ₹0
                          </p>
                        )}
                        <p className="mt-1 font-semibold">
                          Total Penalty: ₹{totalPenalty}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center mt-4 text-sm">
              No staff assigned yet.
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete?</h3>
            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to delete "{currentWork.title}"?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Staff</h3>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-gray-600 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>

            {availableStaff.length ? (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {availableStaff.map((s) => (
                  <label
                    key={s._id}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      value={s._id}
                      onChange={() => toggleStaffSelection(s._id)}
                      className="cursor-pointer"
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No staff available</p>
            )}

            <button
              onClick={handleAddStaff}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Add Selected
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {editingStaff && isAdmin && (
        <PaymentPopup
          isOpen={!!editingStaff}
          staff={editingStaff}
          onClose={() => setEditingStaff(null)}
          onUpdate={(data) => handleStaffUpdate(editingStaff.user._id, data)}
        />
      )}
    </div>
  );
}

export default WorkDetails;
