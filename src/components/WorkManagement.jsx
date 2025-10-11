import { useState, useContext } from "react";
import { FaUsers, FaUserCheck, FaCalendarAlt, FaPlus } from "react-icons/fa";
import WorkContext from "../context/WorkContext";
import UserContext from "../context/UserContext";
import AddWork from "./AddWork";
import WorkDetails from "./WorkDetails";

function WorkManagement() {
  const { works, updateWorkStatus, loading } = useContext(WorkContext);
  const { user } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);

  // ✅ Pass string directly, not object
  const handleStatusChange = async (workId, newStatus) => {
    await updateWorkStatus(workId, newStatus);
  };

  // Filter and sort works (latest date first)
  const filteredWorks = works
    .filter(
      (work) =>
        work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading works...</p>;

  return (
    <div className="relative flex flex-col h-[85vh] overflow-y-scroll p-4 md:overflow-hidden">
      {/* Header */}
      {!selectedWork && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            Manage all your catering assignments
          </h2>
        </div>
      )}

      {/* Search & Add */}
      <div className="flex items-center gap-3 w-full sm:w-auto mb-6">
        <input
          type="text"
          placeholder="Search Work..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {(user?.role === "admin" || user?.role === "superadmin") && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add
          </button>
        )}
      </div>

      {/* Work Cards */}
      {!selectedWork && (
        <>
          {filteredWorks.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No work available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorks.map((work) => {
                const isAssignedToMe = work.assignedTo?.some(
                  (a) => a.user?._id === user?._id
                );

                let statusColor = "bg-gray-500";
                if (work.status === "completed") statusColor = "bg-green-500";
                else if (work.status === "in progress")
                  statusColor = "bg-yellow-500";

                return (
                  <div
                    key={work._id}
                    onClick={() => setSelectedWork(work)}
                    className={`relative cursor-pointer rounded-md shadow-md hover:shadow-xl p-6 bg-white border border-gray-100 transform transition-all ${
                      isAssignedToMe ? "ring-2 ring-green-400" : ""
                    }`}
                  >
                    {/* Title & Status */}
                    <div className="flex justify-between items-start mb-3">
                      <h3
                        className={`text-2xl font-semibold ${
                          isAssignedToMe ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        {work.title}
                      </h3>

                      {(user?.role === "admin" || user?.role === "superadmin") ? (
                        <select
                          value={work.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleStatusChange(work._id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full text-white ${statusColor}`}
                        >
                          {work.status || "Pending"}
                        </span>
                      )}
                    </div>

                    {/* Info Row */}
                    <div className="flex flex-col text-gray-500 font-medium justify-between text-xs space-y-2 pt-3">
                      <span className="flex items-center gap-2">
                        <FaUsers />
                        <strong>Total Members Required:</strong>{" "}
                        {work.totalMembers || 0}
                      </span>

                      <span className="flex items-center gap-2">
                        <FaUserCheck />
                        <strong>Joined:</strong> {work.assignedTo?.length || 0}
                      </span>

                      <span className="flex items-center gap-2">
                        <FaCalendarAlt />
                        <strong>Date:</strong>{" "}
                        {work.dueDate
                          ? new Date(work.dueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Work Details View */}
      {selectedWork && (
        <WorkDetails work={selectedWork} onClose={() => setSelectedWork(null)} />
      )}

      {/* Add Work Modal */}
      {(user?.role === "admin" || user?.role === "superadmin") && (
        <AddWork
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default WorkManagement;
