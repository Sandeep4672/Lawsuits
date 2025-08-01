import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post("https://lawsuits.onrender.com/auth/send-otp", { email });
      if (res.status === 200) {
        setMessage("OTP sent to your email.");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      if (err.response?.statusCode === 500) navigate("/500");
      setError(err.response?.data?.message || "Failed to send OTP.");
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
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            Forgot Password
          </h2>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border border-gray-600 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className=" cursor-pointer w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
            >
              Send OTP
            </motion.button>
            
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-green-500 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
