import React from "react";
import {  useNavigate} from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const navigate =useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center px-4">
      <motion.div
        className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button
      onClick={() => navigate(-1)}
      className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
    >
      Go Back
    </button>
      </motion.div>
    </div>
  );
}
