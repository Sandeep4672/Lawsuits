import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputFIeld";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
export default function LawyerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/lawyer/login", {
        email,
        password,
      });
      const { accessToken, user } = res.data.data;
      localStorage.setItem("lawyerId", user._id);
      login(accessToken, user,password,true);
      navigate("/lawyer-dashboard");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
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
         className="max-w-md w-full bg-gray-900 p-8 shadow-2xl shadow-blue-400 rounded-2xl border border-blue-700 ">
          <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
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
              className="bg-gray-800 text-white border border-gray-600"
              labelClass="text-white"
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="bg-gray-800 text-white border border-gray-600"
              labelClass="text-white"
            />

            {message && (
              <p className="text-center text-red-400 text-sm">{message}</p>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-medium transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a
                href="/lawyer-signup"
                className="text-cyan-400 font-medium hover:underline"
              >
                Signup here
              </a>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer/>
    </>
  );
}
