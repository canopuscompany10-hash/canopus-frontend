import { useContext, useMemo } from "react";
import {
  FaUsers,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
} from "react-icons/fa";
import UserContext from "../context/UserContext";
import WorkContext from "../context/WorkContext";

function DashboardHome() {
  const { allUsers = [], loading: usersLoading } = useContext(UserContext);
  const { works = [], loading: worksLoading } = useContext(WorkContext);

  const staffUsers = useMemo(
    () => allUsers.filter((u) => u.role.toLowerCase() === "staff"),
    [allUsers]
  );

  const { totalWorks, completedWorks, pendingWorks } = useMemo(() => {
    const completed = works.filter(
      (w) =>
        w.status.toLowerCase() === "done" ||
        w.status.toLowerCase() === "completed"
    ).length;
    return {
      totalWorks: works.length,
      completedWorks: completed,
      pendingWorks: works.length - completed,
    };
  }, [works]);

  const latestWorks = useMemo(
    () =>
      [...works]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    [works]
  );

  if (usersLoading || worksLoading) {
    return (
      <p className="text-center text-gray-500 mt-10 text-lg">Loading...</p>
    );
  }

  const cardData = [
    {
      title: "Total Staffs",
      count: staffUsers.length,
      icon: <FaUsers className="text-3xl text-blue-500" />,
    },
    {
      title: "Total Works",
      count: totalWorks,
      icon: <FaTasks className="text-3xl text-green-500" />,
    },
    {
      title: "Completed Works",
      count: completedWorks,
      icon: <FaCheckCircle className="text-3xl text-emerald-500" />,
    },
    {
      title: "Pending Works",
      count: pendingWorks,
      icon: <FaHourglassHalf className="text-3xl text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-8">
      <p className="font-semibold text-gray-500">
        Welcome back! Here's your latest overview
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between p-5 px-7  md:w-full  w-[90%] rounded-md shadow-sm border border-gray-100 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {card.title}
              </p>
              <div className="flex flex-col">{card.icon}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{card.count}</h2>
          </div>
        ))}
      </div>

      {/* Latest Works Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 md:overflow-hidden overflow-scroll">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Latest Works</h2>
          <FaCalendarAlt className="text-gray-500" />
        </div>

        <table className="min-w-full text-sm md:overflow-x-hidden overflow-x-scroll">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Assigned To</th>
              <th className="py-3 px-4 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {latestWorks.length > 0 ? (
              latestWorks.map((work) => (
                <tr
                  key={work._id}
                  className="border-t hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    {work.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        work.status.toLowerCase() === "done" ||
                        work.status.toLowerCase() === "completed"
                          ? "bg-green-100 text-green-700"
                          : work.status.toLowerCase() === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {work.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {work.assignedTo && work.assignedTo.length > 0
                      ? work.assignedTo
                          .map((a) => a.user?.name || a.name || "Unnamed")
                          .join(", ")
                      : "Not assigned"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {work.dueDate
                      ? new Date(work.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No recent works found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardHome;
