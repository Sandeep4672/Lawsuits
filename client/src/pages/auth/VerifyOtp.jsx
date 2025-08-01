import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/auth/verify-otp", {
        email,
        otp,
      });

      if (res.status === 200) {
        navigate("/change-password", { state: { email } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-white px-4">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-700">Verify OTP</h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full bg-yellow-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-yellow-700 transition"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
}
