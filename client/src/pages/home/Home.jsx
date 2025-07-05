import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Chatbot from "../../components/User/chatBot";
import axios from "axios";
import FrequentlyAskedQn from "./faq";
export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl"
          >
            <h1 className="pt-24 text-4xl sm:text-5xl font-extrabold text-green-400 mb-4 animate-fade-in-down">
              <img
                src="/Logo2.png"
                alt="LawSuits Logo"
                className="inline-block align-middle w-12 h-12 mr-2"
              />
              Welcome to <span className="text-blue-400">LawSuits</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10">
              Empowering you with easy access to legal insights, verified
              lawyers, and instant AI summaries for your legal queries.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
              {/* User Section */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px #22c55e",
                  borderColor: "#22c55e",
                }}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-gray-600 shadow-md p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-green-400 mb-5">
                  👥 For Users
                </h2>
                <p className="text-gray-300 mb-4">
                  Access your dashboard, track legal queries, and connect with
                  lawyers easily.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2 border border-green-400 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </motion.div>

              {/* Lawyer Section */}
              <motion.div
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 15px #3b82f6",
                  borderColor: "#3b82f6",
                }}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-gray-600 shadow-md p-8 transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-blue-400 mb-5">
                  ⚖️ For Lawyers
                </h2>
                <p className="text-gray-300 mb-4">
                  Manage client requests, update availability, and offer legal
                  guidance.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/lawyer-login"
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Lawyer Login
                  </Link>
                  <Link
                    to="/lawyer-signup"
                    className="px-6 py-2 border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition"
                  >
                    Lawyer Sign Up
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
 < FrequentlyAskedQn/>
        
      </div>
      <Chatbot />
      <Footer />
    </>
  );
}
