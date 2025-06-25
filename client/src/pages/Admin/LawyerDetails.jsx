import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function LawyerDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [lawyer, setLawyer] = useState(state?.lawyer || null);
  const [actionLoading, setActionLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!lawyer) {
      axios.get(`http://localhost:8000/lawyer/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setLawyer(res.data))
        .catch((err) => console.error("Error fetching lawyer details:", err));
    }
  }, [id, lawyer]);

  const handleStatusUpdate = async (newStatus) => {
  setActionLoading(true);
  try {
    const endpoint =
      newStatus === "accept"
        ? `http://localhost:8000/admin/lawyer-request/${id}/accept`
        : `http://localhost:8000/admin/lawyer-request/${id}/reject`;

    const token = localStorage.getItem("token");
    const res = await axios.patch(
      endpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLawyer((prev) => ({
      ...prev,
      isLawyer: newStatus === "accept" ? "yes" : "no",
    }));
  } catch (err) {
    console.error("Failed to update lawyer status", err);
  } finally {
    setActionLoading(false);
  }
};

  if (!lawyer) return <div className="pt-32 text-center text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-green-100 to-green-50 px-4 py-12">
      <motion.div
        className="max-w-3xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-green-800 mb-8 animate-bounce text-center">👨‍⚖️ Lawyer Profile</h2>

        <div className="space-y-5 text-lg text-gray-800">
          <div className="flex justify-between">
            <span className="font-semibold">Full Name:</span>
            <span>{lawyer.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{lawyer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Phone:</span>
            <span>{lawyer.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Bar Council ID:</span>
            <span>{lawyer.barId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Practice Areas:</span>
            <span>{Array.isArray(lawyer.practiceAreas) ? lawyer.practiceAreas.join(", ") : lawyer.practiceAreas}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Experience:</span>
            <span>{lawyer.experience} years</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Application Status:</span>
            <span className={`font-bold animate-pulse ${lawyer.isLawyer === 'yes' ? 'text-green-600' : lawyer.isLawyer === 'no' ? 'text-red-600' : 'text-yellow-600'}`}>
              {lawyer.isLawyer || "pending"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        
          <div className="mt-8 flex gap-4 justify-center">
            <button
              disabled={actionLoading || lawyer.isLawyer === 'yes'}
              onClick={() => handleStatusUpdate("accept")}
              className="px-6 py-2 cursor-pointer bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Accept
            </button>
            <button
              disabled={actionLoading || lawyer.isLawyer === 'no'}
              onClick={() => handleStatusUpdate("reject")}
              className="px-6 py-2 cursor-pointer bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>
        
      </motion.div>
    </div>
  );
}
