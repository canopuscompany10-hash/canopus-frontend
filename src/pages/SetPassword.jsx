import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setPassword } = useContext(UserContext);
  const [password, setPasswordInput] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await setPassword(token, password);
      setMessage(res.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error setting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Set Your Password</h2>
        {message && <p className="mb-3">{message}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPasswordInput(e.target.value)}
          className="w-full p-3 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}

export default SetPassword;
