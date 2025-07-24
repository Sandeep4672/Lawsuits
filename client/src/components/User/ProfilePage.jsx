import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../Navbar";
import { useLocation } from "react-router-dom";
import Footer from "../Footer";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);

  const handleInitiatePasswordChange = async () => {
    try {
      await axios.post("https://lawsuits.onrender.com/auth/send-otp", {
        email: user.email,
      });
      setShowOtpSection(true);
      setOtpMessage("📨 OTP sent to your email.");
    } catch (err) {
      setOtpMessage("❌ Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("https://lawsuits.onrender.com/auth/verify-otp", {
        email: user.email,
        otp,
      });

      if (res.status === 200) {
        setOtpVerified(true);
        setOtpMessage("✅ OTP verified successfully.");
      }
    } catch (err) {
      setOtpMessage("❌ Invalid OTP. Try again.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      setMessage("❌ Please verify OTP before changing password.");
      setSuccess(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password does not match.");
      setSuccess(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "https://lawsuits.onrender.com/auth/change-password",
        {
          user,
          oldPassword: currentPassword,
          newPassword,
          confPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setMessage("✅ Password updated successfully.");
        setCurrentPassword("");
        setConfirmPassword("");
        setNewPassword("");
        setSuccess(true);
        setOtpVerified(false);
        setShowOtpSection(false);
      }
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || "Update failed."}`);
      setSuccess(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 px-4 bg-[#0f172a] text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-[#1e293b] rounded-2xl shadow-lg p-8 border border-gray-700"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            👤 Profile Details
          </h2>

          <div className="space-y-3 text-lg text-gray-200 mb-8">
            <div>
              <strong>Name:</strong> {user?.fullName}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
          </div>

          {!showOtpSection && !otpVerified && (
            <button
              onClick={handleInitiatePasswordChange}
              className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white font-medium"
            >
              🔄 Change Password
            </button>
          )}

          {showOtpSection && !otpVerified && (
            <>
              <h3 className="text-xl mb-2 text-yellow-300 font-semibold mt-6">
                🔐 Verify OTP to proceed
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="px-3 py-2 rounded bg-[#0f172a] border border-gray-500 text-white w-2/3"
                />
                <button
                  onClick={verifyOtp}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  Verify OTP
                </button>
              </div>
              <button
                onClick={handleInitiatePasswordChange}
                className="bg-gray-700 hover:bg-gray-800 px-3 py-2 rounded text-white text-sm"
              >
                Resend OTP
              </button>
              {otpMessage && (
                <p className="text-sm mt-2 text-yellow-400">{otpMessage}</p>
              )}
            </>
          )}

          {otpVerified && (
            <>
              <h3 className="text-2xl font-semibold text-green-500 mt-6 mb-4">
                🔒 Change Password
              </h3>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f172a] border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
                >
                  Update Password
                </button>
              </form>
            </>
          )}

          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                success ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
