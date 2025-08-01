import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

export default function LawyerForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("https://lawsuits.onrender.com/auth/send-otp", { email });
      if (res.status === 200) {
        setMessage("OTP sent to your email.");
        setTimeout(() => {
          navigate("/lawyer-verify-otp", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-900 p-8 shadow-2xl shadow-blue-400 rounded-2xl border border-blue-700"
        >
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
            🔐 Forgot Password
          </h2>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Send OTP
            </motion.button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Remember your password?{" "}
              <a
                href="/lawyer-login"
                className="text-cyan-400 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
