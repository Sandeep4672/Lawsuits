import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function VerifyOtpAndUpdatePassword() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/auth/verify-otp-change-password", {
        email: state?.email,
        otp,
        password,
      });

      if (res.data.success) {
        setMessage("Password updated successfully!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      if (err.response?.statusCode === 500) navigate("/500");
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

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
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400"> Reset Password</h2>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
            >
              Update Password
            </motion.button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
