import { createContext, useState, useEffect } from "react";
import AxiosInstance from "../lib/axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState({ email: true, whatsapp: true });
  const [loading, setLoading] = useState(true);

  // ✅ Load user & token on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setNotifications(parsedUser.notifications || { email: true, whatsapp: true });

      // Attach token globally for all Axios requests
      AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    fetchAllUsers().finally(() => setLoading(false));
  }, []);

  // ✅ Fetch all users
  const fetchAllUsers = async () => {
    try {
      const res = await AxiosInstance.get("/user/all");
      setAllUsers(res.data || []);
    } catch (err) {
      console.error("Fetch Users Error:", err.response?.data || err);
    }
  };

  // ✅ Create new user (admin only)
  const createUser = async (userData) => {
    try {
      const res = await AxiosInstance.post("/user/create", userData);
      const createdUser = res.data.user;
      setAllUsers((prev) => [...prev, createdUser]);
      return createdUser;
    } catch (err) {
      console.error("Create User Error:", err.response?.data || err);
      throw err;
    }
  };

  // ✅ Login user
  const loginUser = async (email, password) => {
    try {
      const res = await AxiosInstance.post("/user/login", { email, password });
      const { user: loggedInUser, token } = res.data;

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", token);

      AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await fetchAllUsers();
      return loggedInUser;
    } catch (err) {
      console.error("Login Error:", err.response?.data || err);
      throw err;
    }
  };

  // ✅ Update user
  const updateUser = async (updates) => {
    if (!user) return;
    try {
      const res = await AxiosInstance.put(`/user/${user._id}`, updates);
      const updatedUser = res.data.user;

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      await fetchAllUsers();
      return updatedUser;
    } catch (err) {
      console.error("Update User Error:", err.response?.data || err);
      throw err;
    }
  };

  // ✅ Update notification preferences
  const updateNotifications = async (prefs) => {
    if (!user) return;
    try {
      const res = await AxiosInstance.patch(`/user/${user._id}/notifications`, prefs);
      const updatedNotifications = res.data.notifications;

      setNotifications(updatedNotifications);
      const updatedUser = { ...user, notifications: updatedNotifications };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Update Notifications Error:", err.response?.data || err);
    }
  };

  // ✅ Toggle attendance locally (for demo/tracking)
  const toggleAttendance = () => {
    if (!user) return;
    const updated = { ...user, attendance: !user.attendance };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
  };

  // ✅ Logout
  const logoutUser = () => {
    setUser(null);
    setAllUsers([]);
    setNotifications({ email: true, whatsapp: true });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete AxiosInstance.defaults.headers.common["Authorization"];
  };

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        notifications,
        loading,
        setUser,
        createUser,
        loginUser,
        updateUser,
        updateNotifications,
        toggleAttendance,
        logoutUser,
        fetchAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
