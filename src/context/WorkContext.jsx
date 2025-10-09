import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const WorkContext = createContext();

export const WorkProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch all works
  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await AxiosInstance.get("/work");
      setWorks(res.data || []);
      console.log(res.data, "Fetched works");
    } catch (err) {
      console.error("Fetch Works Error:", err.response?.data || err);
      toast.error("Failed to fetch works.");
      setMessage("Failed to fetch works.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Normalize assigned users
  const normalizeAssignedTo = (assignedTo) => {
    if (!assignedTo) return [];
    if (!Array.isArray(assignedTo)) assignedTo = [assignedTo];
    return assignedTo
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.value || item?.user?._id || item?._id
      )
      .filter(Boolean);
  };

  // ✅ Add new work
  const addWork = async (workData) => {
    try {
      workData.assignedTo = normalizeAssignedTo(workData.assignedTo);

      if (workData.budget) workData.budget = parseFloat(workData.budget);

      // Set totalMembers to provided value or default to assignedTo length
      if (!workData.totalMembers)
        workData.totalMembers = workData.assignedTo.length;

      const res = await AxiosInstance.post("/work", workData);
      setWorks((prev) => [...prev, res.data.work]);
      toast.success("Work added successfully!");
      setMessage("Work added successfully.");
    } catch (err) {
      console.error("Add Work Error:", err.response?.data || err);
      toast.error(err?.response?.data?.message || "Add work failed");
      setMessage("Add work failed.");
    }
  };

  // ✅ Update work
  const updateWork = async (workId, updatedData) => {
    try {
      updatedData.assignedTo = normalizeAssignedTo(updatedData.assignedTo);

      if (updatedData.budget)
        updatedData.budget = parseFloat(updatedData.budget);

      // Ensure totalMembers is numeric
      if (updatedData.totalMembers !== undefined)
        updatedData.totalMembers = parseInt(updatedData.totalMembers);

      const res = await AxiosInstance.put(`/work/${workId}`, updatedData);
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      console.log(res.data, "Updated work");
      toast.success("Work updated successfully!");
      setMessage("Work updated successfully.");
    } catch (err) {
      console.error("Update Work Error:", err.response?.data || err);
      toast.error(err?.response?.data?.message || "Update work failed");
      setMessage("Update work failed.");
    }
  };

  // ✅ Delete work
  const deleteWork = async (workId) => {
    try {
      await AxiosInstance.delete(`/work/${workId}`);
      setWorks((prev) => prev.filter((w) => w._id !== workId));
      toast.success("Work deleted successfully!");
      setMessage("Work deleted successfully.");
    } catch (err) {
      console.error("Delete Work Error:", err.response?.data || err);
      toast.error(err?.response?.data?.message || "Delete work failed");
      setMessage("Delete work failed.");
    }
  };

  // ✅ Update individual staff payment/performance
  const updateStaffPayment = async (workId, staffId, data) => {
    try {
      if (data.amountPaid !== undefined)
        data.amountPaid = parseFloat(data.amountPaid);

      // Ensure violations is an array
      if (!Array.isArray(data.violations)) data.violations = [];

      const res = await AxiosInstance.patch(
        `/work/${workId}/staff/${staffId}`,
        data
      );
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      console.log(res.data, "Updated staff payment");
      toast.success("Staff payment updated!");
      setMessage("Staff payment updated.");
    } catch (err) {
      console.error("Update Staff Payment Error:", err.response?.data || err);
      toast.error(
        err?.response?.data?.message || "Failed to update staff payment"
      );
      setMessage("Failed to update staff payment.");
    }
  };

  // ✅ Fetch single work
  const fetchWorkWithStatus = async (workId) => {
    try {
      const res = await AxiosInstance.get(`/work/${workId}`);
      console.log(res.data, "Fetched single work");
      return res.data;
    } catch (err) {
      console.error("Fetch Work Error:", err.response?.data || err);
      toast.error(err?.response?.data?.message || "Failed to fetch work");
      setMessage("Failed to fetch work details.");
      return null;
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  return (
    <WorkContext.Provider
      value={{
        works,
        loading,
        message,
        fetchWorks,
        addWork,
        updateWork,
        deleteWork,
        updateStaffPayment,
        fetchWorkWithStatus,
        setMessage,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export default WorkContext;
