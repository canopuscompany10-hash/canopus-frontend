import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginimage.jpg";
import UserContext from "../context/UserContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !formData.password) {
      setError("Please fill all required fields.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
   
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const loggedInUser = await loginUser(formData.email, formData.password);
      if (loggedInUser) {
        navigate("/dashboard"); // ✅ Redirect after successful login
      } else {
        setError("Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row p-4 md:p-16 gap-6 bg-gray-50">
      {/* Left Image Section */}
      <div className="md:flex-1 w-full rounded-md">
        <img
          src={loginImage}
          alt="Auth"
          className="w-full h-64 md:h-full object-cover rounded-l-md"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 md:p-10">
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
            Login
          </h2>

          {error && (
            <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
