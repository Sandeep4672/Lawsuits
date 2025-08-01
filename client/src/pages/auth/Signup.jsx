import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import {
  generateRSAKeyPair,
  encryptWithPassword,
} from "../../utils/cryptoUtils";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const sendOtp = async () => {
    try {
      const res = await axios.post(
        "https://lawsuits.onrender.com/auth/send-otp",
        {
          email: formData.email,
        }
      );
      setOtpSent(true);
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError("Failed to send OTP");
    }
  };
  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        "https://lawsuits.onrender.com/auth/verify-otp",
        {
          email: formData.email,
          otp,
        }
      );
      setOtpVerified(true);
      setSuccess("OTP verified. You can now sign up.");
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setError("Please verify OTP first");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // RSA encryption logic remains same
      const { publicKey, privateKey } = await generateRSAKeyPair();
      const { encrypted, salt, iv } = await encryptWithPassword(
        privateKey,
        formData.password
      );

      const res = await axios.post(
        "https://lawsuits.onrender.com/auth/signup",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          rsaPublicKey: publicKey,
          encryptedPrivateKey: encrypted,
          salt,
          iv,
        }
      );

      if (res.status === 201) {
        setSuccess("Account created!");
        localStorage.setItem("encryptionPassword", formData.password);
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 min-h-screen flex flex-col justify-center items-center bg-[#0f172a] text-white px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1e293b] p-10 rounded-2xl shadow-2xl shadow-green-500 w-full max-w-lg border border-[#334155]"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-green-400 tracking-wide">
            Create Account
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm text-center mb-4">{success}</p>
          )}

          <div className="space-y-5">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#475569] bg-[#0f172a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#475569] bg-[#0f172a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            {/* OTP Section */}
            {!otpVerified ? (
              <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-4 mt-2">
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="cursor-pointer text-sm text-green-400 hover:underline hover:text-green-300"
                  >
                    Verify email
                  </button>
                ) : (
                  <>
                    <label className="block mb-2 text-sm text-gray-400">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 mb-2 border border-[#475569] bg-[#0f172a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                       Verify OTP
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-green-400 text-sm text-center mb-2">
                ✅ OTP Verified
              </div>
            )}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#475569] bg-[#0f172a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#475569] bg-[#0f172a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-8 w-full cursor-pointer bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
          >
            🚀 Sign Up
          </motion.button>

          <p className="text-center text-sm mt-6 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-300 hover:underline">
              Login here
            </a>
          </p>
        </motion.form>
      </div>

      <Footer />
    </>
  );
}