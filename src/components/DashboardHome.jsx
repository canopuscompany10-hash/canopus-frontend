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
      <p className="text-left text-gray-500 mt-10 text-lg w-full max-w-7xl mx-auto px-4">
        Loading...
      </p>
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
    <div className="space-y-8 flex flex-col items-start md:w-full w-full px-4 ">
      {/* Welcome Text */}
      <p className="font-semibold text-gray-500 text-left w-full max-w-7xl">
        Welcome back! Here's your latest overview
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between p-5 rounded-md shadow-sm border border-gray-100 hover:shadow-md transform hover:scale-[1.02] transition-all duration-200 w-full"
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                {card.title}
              </p>
              <div>{card.icon}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-3">{card.count}</h2>
          </div>
        ))}
      </div>

      {/* Latest Works Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full overflow-y-scroll h-[50vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Latest Works</h2>
          <FaCalendarAlt className="text-gray-500" />
        </div>

        <div className="flex flex-col w-full">
          {/* Table header for large screens */}
          <div className="hidden sm:flex bg-gray-100 font-semibold text-gray-700 px-4 py-2">
            <div className="w-1/4">Title</div>
            <div className="w-1/4">Status</div>
            <div className="w-1/4">Members required </div>
            <div className="w-1/4">Due Date</div>
          </div>

          {/* Rows */}
          {latestWorks.length > 0 ? (
            latestWorks.map((work) => (
              <div
                key={work._id}
                className="flex flex-col sm:flex-row border-t hover:bg-gray-50 transition-all duration-150 px-4 py-3 gap-1 sm:gap-0"
              >
                {/* Title */}
                <div className="flex justify-between sm:w-1/4 w-full">
                  <span className="font-semibold text-gray-800">{work.title}</span>

                  {/* Status visible on small screens beside title */}
                  <span
                    className={`sm:hidden px-3 py-1 rounded-full text-xs font-semibold ${
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
                </div>

            {/* Status for large screens */}
<div className="hidden sm:block sm:w-1/4 mt-1 sm:mt-0">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      work.status.toLowerCase() === "done" || work.status.toLowerCase() === "completed"
        ? "bg-green-100 text-green-700"
        : work.status.toLowerCase() === "in-progress"
        ? "bg-blue-100 text-blue-700"
        : work.status.toLowerCase() === "due"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {work.status}
  </span>
</div>


<div className="w-full sm:w-1/4 mt-1 sm:mt-0 text-gray-600  hidden sm:block">
  <div className="overflow-x-auto whitespace-nowrap">
   {work.totalMembers}
  </div>
</div>


                {/* Due Date (hide on small screens) */}
                <div className="w-full sm:w-1/4 mt-1 sm:mt-0 text-gray-600 hidden sm:block">
                  {work.dueDate ? new Date(work.dueDate).toLocaleDateString() : "—"}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-gray-500 italic">No recent works found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
