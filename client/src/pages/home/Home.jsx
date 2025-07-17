import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Chatbot from "../../components/User/chatBot";
import FrequentlyAskedQn from "./faq";

import {
  Gavel,
  Bot,
  Search,
  User,
  Scale,
  Users,
  CheckCircle,
  ShieldCheck,
  GaugeCircle,
  Headset,
  ChevronDown,
} from "lucide-react";

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
      <div className="min-h-screen  pb-20 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center px-6 pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-slate-900" />
          <div className="relative z-10 text-center max-w-6xl">
            <div className="flex items-center justify-center mb-8">
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxsYXd8ZW58MHx8fHwxNzUyNjkyMDg0fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="LawSuits Logo"
                className="w-16 h-16 mr-4"
              />
              <h1 className="text-5xl lg:text-7xl font-bold text-green-400">
                Law<span className="text-blue-500">Suits</span>
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Empowering you with easy access to legal insights, verified lawyers, and instant AI summaries for your legal queries
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link to="/login">
                <button className=" cursor-pointer bg-primary-600 hover:bg-primary-700 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 min-w-48">
                  Get Started
                </button>
              </Link>
              <Link to="/about">
                <button className="cursor-pointer border-2 border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 min-w-48">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-20 max-w-6xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-8 rounded-xl shadow-md hover:bg-slate-700  hover:shadow-blue-400 transition-all duration-300 text-center"
          >
            <Gavel className="text-primary-400 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">Legal Insights</h3>
            <p className="text-slate-400">
              Get instant access to comprehensive legal information and case studies
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-blue-400 hover:bg-slate-700 transition-all duration-300 text-center"
          >
            <Search className="text-primary-400 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">Verified Lawyers</h3>
            <p className="text-slate-400">
              Connect with qualified and verified legal professionals in your area
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-800 p-8 rounded-xl shadow-md hover:shadow-blue-400 hover:bg-slate-700 transition-all duration-300 text-center"
          >
            <Bot className="text-primary-400 w-10 h-10 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-3">AI Summaries</h3>
            <p className="text-slate-400">
              Receive instant AI-powered summaries for your legal queries and documents
            </p>
          </motion.div>
        </div>

      
        

        {/* Why Choose Section */}
        <div className="py-20 px-8 bg-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-8">Why Choose LawSuits?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Trusted</h3>
                <p className="text-slate-400">
                  Your data is protected with enterprise-grade security measures
                </p>
              </div>

              <div className="p-6">
                <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GaugeCircle className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast & Efficient</h3>
                <p className="text-slate-400">
                  Get instant responses and quick connections to legal professionals
                </p>
              </div>

              <div className="p-6">
                <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headset className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
                <p className="text-slate-400">
                  Round-the-clock assistance whenever you need legal guidance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <FrequentlyAskedQn /> */}
      </div>

      {/* Chat and Footer */}
      <Chatbot />
      <Footer />
    </>
  );
}
