import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // assuming user object contains email

  useEffect(() => {
    if (!token || !user?.email) {
      navigate("/login"); // redirect if not authenticated
    }
  }, [navigate, token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        "https://lawsuits.onrender.com/auth/change-password",
        {
          email: user.email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // if backend checks JWT
          },
        }
      );

      if (res.status === 200) {
        setMessage("Password changed successfully.");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      if(err.response?.statusCode===500)
      {
        navigate("/500");
      }
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Reset Password
        </h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          required
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-800 transition"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
