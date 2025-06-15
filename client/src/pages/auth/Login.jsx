import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../../context/AuthContext";
export default function Login() {
  const navigate = useNavigate();
  const {login} =useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {

        setSuccess("Login successful");
        // we can save token to localStorage here if returned
        // localStorage.setItem("token", res.data.token);
        
        login(res.data.data.accessToken);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Welcome Back</h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-4">{success}</p>}

        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
        </div>

        <div className="text-right mt-2">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-800 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
