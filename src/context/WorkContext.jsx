import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const WorkContext = createContext();

export const WorkProvider = ({ children }) => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch all works
  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await AxiosInstance.get("/work");
      setWorks(res.data);
    } catch (err) {
      console.error("Fetch Works Error:", err);
      toast.error("Failed to fetch works.");
      setMessage("Failed to fetch works.");
    } finally {
      setLoading(false);
    }
  };

  // Normalize assigned users (to expected format)
  const normalizeAssignedTo = (assignedTo) => {
    if (!assignedTo) return [];
    if (!Array.isArray(assignedTo)) assignedTo = [assignedTo];
    return assignedTo
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.value || item?.user?._id || item?._id
      )
      .filter(Boolean)
      .map((id) => ({
        user: id,
        amountPaid: 0,
        paymentStatus: "pending",
        violations: [],
      }));
  };

  // Add new work
  const addWork = async (workData) => {
    try {
      workData.assignedTo = normalizeAssignedTo(workData.assignedTo);
      if (workData.budget) workData.budget = parseFloat(workData.budget);
      if (!workData.totalMembers)
        workData.totalMembers = workData.assignedTo.length;
      workData.overallPaymentStatus = "pending";

      const res = await AxiosInstance.post("/work", workData);
      setWorks((prev) => [...prev, res.data.work]);
      toast.success("Work added successfully!");
      setMessage("Work added successfully.");
    } catch (err) {
      console.error("Add Work Error:", err);
      toast.error(err.response?.data?.message || "Add work failed");
      setMessage(err.response?.data?.message || "Add work failed");
    }
  };

  // Update existing work
  const updateWork = async (workId, updatedData) => {
    try {
      if (updatedData.assignedTo)
        updatedData.assignedTo = normalizeAssignedTo(updatedData.assignedTo);

      if (updatedData.budget) updatedData.budget = parseFloat(updatedData.budget);
      if (updatedData.totalMembers !== undefined)
        updatedData.totalMembers = parseInt(updatedData.totalMembers);

      const res = await AxiosInstance.put(`/work/${workId}`, updatedData);
      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );
      toast.success("Work updated successfully!");
      setMessage("Work updated successfully.");
    } catch (err) {
      console.error("Update Work Error:", err);
      toast.error(err.response?.data?.message || "Update work failed");
      setMessage("Update work failed.");
    }
  };

  // Delete work by ID
  const deleteWork = async (workId) => {
    try {
      await AxiosInstance.delete(`/work/${workId}`);
      setWorks((prev) => prev.filter((w) => w._id !== workId));
      toast.success("Work deleted successfully!");
      setMessage("Work deleted successfully.");
    } catch (err) {
      console.error("Delete Work Error:", err);
      toast.error(err.response?.data?.message || "Delete work failed");
      setMessage("Delete work failed");
    }
  };

  // Update staff payment and recalc overall payment status
  const updateStaffPayment = async (workId, staffId, data) => {
    try {
      if (data.amountPaid !== undefined) data.amountPaid = parseFloat(data.amountPaid);
      if (!Array.isArray(data.violations)) data.violations = [];

      const res = await AxiosInstance.patch(`/work/${workId}/staff/${staffId}`, data);
      const updatedWork = res.data.work;

      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? updatedWork : w))
      );

      toast.success("Staff payment updated!");
      setMessage("Staff payment updated.");
    } catch (err) {
      console.error("Update Staff Payment Error:", err);
      toast.error(err.response?.data?.message || "Failed to update staff payment");
      setMessage("Failed to update staff payment");
    }
  };

  // Update work status
  const updateWorkStatus = async (workId, status) => {
    try {
      const res = await AxiosInstance.patch(`/work/${workId}/status`, { status });

      setWorks((prev) =>
        prev.map((w) => (w._id === workId ? res.data.work : w))
      );

      toast.success("Work status updated!");
    } catch (err) {
      console.error("Update Work Status Error:", err);
      toast.error("Failed to update work status");
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
        updateWorkStatus,
        setMessage,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};

export default WorkContext;
