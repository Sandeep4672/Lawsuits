import React from "react";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./LawyerNavbar";
import Footer from "../../components/Footer";
import {motion} from "framer-motion";
export default function MyProfile() {
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setLawyer({
        fullName: decoded.fullName,
        email: decoded.email,
        specialization: decoded.practiceAreas,
        experience: decoded.experience,
        barId: decoded.barId,
      });
      setLoading(false);
    } else {
      setMessage("You are not logged in.");
      setLoading(false);
    }
  }, []);

  return (
    <>
     <Navbar />
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
     
      <motion.div 
      initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto bg-gray-700 rounded-xl shadow-2xl shadow-blue-400 p-8 hover:scale-[1.01] ">
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : message ? (
          <p className="text-red-500">{message}</p>
        ) : (
          <div>
            <h2 className="text-2xl text-green-400 font-bold mb-4">My Profile</h2>
            <div className="mb-4 text-gray-200">
              <strong className="text-white">Name:</strong> {lawyer.fullName || lawyer.username}
            </div>
            <div className="mb-4  text-gray-200">
              <strong className="text-white">Bar ID:</strong> {lawyer.barId || "Not provided"}
            </div>
            <div className="mb-4  text-gray-200">
              <strong className="text-white">Email:</strong> {lawyer.email}
            </div>
            <div className="mb-4">
              {Array.isArray(lawyer.specialization) &&
              lawyer.specialization.length > 0 ? (
                lawyer.specialization.map((area, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {area}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">
                  No specialization provided
                </span>
              )}
            </div>
            <div className="mb-4  text-gray-200">
              <strong className="text-white">Experience:</strong> {lawyer.experience} years
            </div>
          </div>
        )}
      </motion.div>
    </div>
    <Footer/>
    </>
  );
}
