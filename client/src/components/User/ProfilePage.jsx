import React, { useContext, useState ,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Navbar from "../Navbar";
import { useLocation } from "react-router-dom";
export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const location=useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password does not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
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
        setMessage("Password updated successfully.");
        setCurrentPassword("");
        setConfirmPassword("");
        setNewPassword("");
        setSuccess(true);
      }
    } catch (err) {
      setMessage("Failed to update password.");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-40 bg-gradient-to-br from-green-100 to-white py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-green-800 text-center animate-bounce">
            👤 Profile Details
          </h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <strong>Name:</strong> {user?.fullName}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              🔒 Change Password
            </h3>
            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md"
              >
                Update Password
              </button>
            </form>
            {message && (
              <p
                className={`mt-4 text-center text-sm ${
                  success ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
