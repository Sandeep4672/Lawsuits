import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { generateRSAKeyPair, encryptWithPassword } from "../../utils/cryptoUtils"; 


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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    // 1. Generate RSA key pair
    const { publicKey, privateKey } = await generateRSAKeyPair();

    // 2. Encrypt the private key using user's password
    const { encrypted, salt, iv } = await encryptWithPassword(privateKey, formData.password);

    // 3. Send the signup request with encrypted key
    const res = await axios.post("http://localhost:8000/auth/signup", {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      rsaPublicKey: publicKey,
      encryptedPrivateKey: encrypted,
      salt,
      iv,
    });

    if (res.status === 201) {
      setSuccess("Account created!");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // OPTIONAL: store password temporarily for decryption later
      localStorage.setItem("encryptionPassword", formData.password);

      navigate("/login");
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Registration failed");
  }
};
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#1e1e2f] text-white px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2a2a3d] p-8 rounded-2xl shadow-2xl shadow-green-400 w-full max-w-md border border-[#3a3a4d]"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
            Create Your Account
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm text-center mb-4">{success}</p>
          )}

          <div className="space-y-4">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-700 bg-[#1f2937] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-full cursor-pointer  bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
          >
            Sign Up
          </motion.button>

          <p className="text-center text-sm mt-6 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-green-300 hover:underline">
              Login here
            </a>
          </p>
        </motion.form>
      </div>

      {/* ✅ Footer aligned to dark theme */}
      <Footer/>
    </>
  );
}
