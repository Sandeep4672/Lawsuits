import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputFIeld";
import Navbar from "../../components/Navbar";
export default function LawyerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/lawyer/login", {
        email,
        password,
      });

      const { token, lawyer } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("lawyerUser", JSON.stringify(lawyer));

      if (lawyer.status === "pending") {
        setMessage("⏳ Your verification is pending. We’ll notify you via email.");
        return;
      }

      navigate("/lawyer-dashboard");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <>
    <Navbar/>
   
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🧑‍⚖️ Lawyer Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lawyer@example.com"
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          {message && (
            <p className="text-center text-red-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg text-lg font-medium"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/lawyer-signup"
              className="text-cyan-700 font-medium hover:underline"
            >
              Signup here
            </a>
          </p>
        </div>
      </div>
    </div>
     </>
  );
}
