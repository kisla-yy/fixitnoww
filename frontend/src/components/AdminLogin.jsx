import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Update formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      const res = await axios.post(
        "https://fixitnoww-production.up.railway.app/api/auth/adminSignin", // backend route
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data?.user) {
        onLogin(res.data.user); // pass user data to App.jsx
        navigate("/admin-dashboard"); // redirect to admin dashboard
      } else {
        setErrors(["Server did not return a user object"]);
      }
    } catch (err) {
      console.error("Login failed:", err);

      const payload =
        err.response?.data?.errors ||
        err.response?.data?.message ||
        err.message ||
        "Something went wrong";

      setErrors(Array.isArray(payload) ? payload : [payload]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

        {errors.length > 0 && (
          <ul className="mb-4 text-red-600 list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email" // must match formData key
            placeholder="Admin Username"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            required
          />
          <input
            type="password"
            name="password" // must match formData key
            placeholder="Admin Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-indigo-300"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
