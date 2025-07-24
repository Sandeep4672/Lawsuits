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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password does not match");
      setSuccess(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        "http://localhost:8000/auth/change-password",
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
         className="max-w-2xl mx-auto bg-[#1e293b] rounded-2xl shadow-lg p-8 border border-gray-700">
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

          <h3 className="text-2xl font-semibold text-green-500 mb-4">
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
      <Footer/>
    </>
  );
}
