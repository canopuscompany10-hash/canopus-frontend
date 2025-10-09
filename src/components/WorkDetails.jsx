import { useContext, useState, useEffect } from "react";
import { FaTimes, FaUser, FaEdit, FaSave, FaTrash } from "react-icons/fa";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import toast from "react-hot-toast";
import PaymentPopup from "./PaymentPopup";

function WorkDetails({ work, onClose }) {
  const { deleteWork, updateStaffPayment, updateWork } =
    useContext(WorkContext);
  const { user } = useContext(UserContext);

  const [staffData, setStaffData] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [currentWork, setCurrentWork] = useState(work);
  const [editableWork, setEditableWork] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setStaffData(work.assignedTo || []);
    setCurrentWork(work);
    setEditableWork({
      title: work.title,
      description: work.description,
      dueDate: work.dueDate,
      totalMembers: work.totalMembers || work.assignedTo?.length || 0,
      budget: work.budget || 0,
    });
  }, [work]);

  if (!work) return null;

  const handleStaffUpdate = async (staffId, data) => {
    try {
      await updateStaffPayment(work._id, staffId, data);

      const updatedStaff = staffData.map((s) =>
        s.user._id === staffId ? { ...s, ...data } : s
      );

      // Recalculate net budget after payments
      const totalPaid = updatedStaff.reduce(
        (sum, s) => sum + (s.amountPaid || 0),
        0
      );
      const netBudget = editableWork.budget - totalPaid;

      await updateWork(work._id, { budget: netBudget });
      setStaffData(updatedStaff);
      setCurrentWork({ ...currentWork, budget: netBudget });
      toast.success("Staff payment and net budget updated!");
    } catch (err) {
      toast.error("Failed to update staff payment");
    }
  };

  const handleWorkUpdate = async () => {
    try {
      // Ensure numeric values
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
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWork(work._id);
      toast.success("Work deleted successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to delete work");
    }
  };

  const progress = work.tasks?.length
    ? Math.round(
        (work.tasks.filter((t) => t.status === "done").length /
          work.tasks.length) *
          100
      )
    : 0;

  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[70vh] relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-2xl text-gray-600 hover:text-red-600"
      >
        <FaTimes />
      </button>

      {/* Staff List */}
      <div className="w-full md:w-1/3 flex flex-col gap-2 bg-white rounded-md p-5 h-[70vh] md:overflow-y-scroll">
        <h2 className="text-xl font-bold text-gray-700 mb-2 border-b pb-2">
          Attended Staff ({staffData.length})
        </h2>
        {staffData.map((s) => (
          <div
            key={s.user._id}
            className="flex justify-between items-center bg-white p-3 rounded-xl shadow mb-2"
          >
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-500" />
              <span className="font-medium text-gray-800">{s.user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                ₹{s.amountPaid || 0}
              </span>
              {user?.role === "admin" && (
                <button
                  onClick={() => setEditingStaff(s)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Work Details */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md border md:overflow-y-scroll border-gray-200 h-[70vh]">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editableWork.title}
              onChange={(e) =>
                setEditableWork({ ...editableWork, title: e.target.value })
              }
              className="text-2xl font-bold border-b border-gray-300 p-1"
            />
          ) : (
            <h2 className="text-2xl font-bold">{currentWork.title}</h2>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentWork.status === "done"
                ? "bg-green-100 text-green-700"
                : currentWork.status === "in-progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {currentWork.status || "Pending"}
          </span>
        </div>

        <div className="mb-4 text-gray-700 space-y-2 text-sm">
          {isEditing ? (
            <>
              <textarea
                value={editableWork.description}
                onChange={(e) =>
                  setEditableWork({
                    ...editableWork,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                value={editableWork.dueDate?.split("T")[0]}
                onChange={(e) =>
                  setEditableWork({ ...editableWork, dueDate: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                value={editableWork.totalMembers}
                onChange={(e) =>
                  setEditableWork({
                    ...editableWork,
                    totalMembers: parseInt(e.target.value),
                  })
                }
                className="border p-2 rounded w-full"
                placeholder="Total Members"
              />
              <input
                type="number"
                value={editableWork.budget}
                onChange={(e) =>
                  setEditableWork({
                    ...editableWork,
                    budget: parseFloat(e.target.value),
                  })
                }
                className="border p-2 rounded w-full"
                placeholder="Budget"
              />
            </>
          ) : (
            <>
              <p>
                <strong>Description:</strong> {currentWork.description}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(currentWork.dueDate).toLocaleDateString()}
              </p>
              {user?.role === "admin" && (
                <p>
                  <strong>Net Budget:</strong> ₹{currentWork.budget}
                </p>
              )}
            </>
          )}

          <div className="flex gap-6">
            <p>
              <strong>Total Members:</strong> {currentWork.totalMembers || 0}
            </p>
            <p>
              <strong>Joined Members:</strong> {staffData.length}
            </p>
          </div>
          <p>
            <strong>Progress:</strong> {progress}%
          </p>
        </div>

        {user?.role === "admin" && (
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleWorkUpdate}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md flex items-center gap-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2"
                >
                  <FaTrash /> Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete?</h3>
            <p className="mb-4">
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

      {/* Payment Popup */}
      {editingStaff && (
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
// a
