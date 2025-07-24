import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      if(err.response?.statusCode===500)
      {
        navigate("/500");
      }
      setError(err.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Forgot Password</h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center mb-4">{message}</p>}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
        >
          Send OTP
        </button>
      </form>
    </div>
  );
}
