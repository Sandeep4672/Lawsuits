import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function InternalServerError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center px-4">
      <motion.div
        className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-lg"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold text-orange-500 mb-4">500</h1>
        <p className="text-xl text-gray-700 mb-2">Internal Server Error</p>
        <p className="text-gray-500 mb-6">
          Something went wrong on our end. Please try again later.
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  );
}
