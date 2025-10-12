import axios from "axios";
const AxiosInstance = axios.create({
  baseURL: "https://canopus-backend-ydod.onrender.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to all requests
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default AxiosInstance;

// https://canopus-backend-ydod.onrender.com asgits
// http://localhost:4000