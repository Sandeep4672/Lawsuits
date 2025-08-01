import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await axios.post(
        "http://localhost:8000/auth/login",
        formData
      );
      if (res.data.success) {
        setSuccess("Login successful");
        login(res.data.data.accessToken, res.data.data.user, formData.password);
        res.data.data.user.isAdmin
          ? navigate("/admin/dashboard")
          : navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.statusCode === 500) navigate("/500");
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleForgotPassword = () => navigate("/forgot-password");

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#1e1e2f] text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2a2a3d] p-8 rounded-2xl shadow-xl shadow-green-400 w-full max-w-md border border-[#3a3a4d] flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            Welcome Back
          </h2>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center mb-4"
            >
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-sm text-center mb-4"
            >
              {success}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="w-full  space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-green-300 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition mt-2"
            >
              Login
            </motion.button>
          </form>

          <div className="text-center mt-6 w-full">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-300 font-medium hover:underline"
              >
                Signup here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
