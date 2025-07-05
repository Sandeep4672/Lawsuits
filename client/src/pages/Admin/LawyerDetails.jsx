import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
export default function LawyerDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const [lawyer, setLawyer] = useState(state?.lawyer || null);
  const [actionLoading, setActionLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [accept, setAccept] = useState("");
  const [reject, setReject] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!lawyer) {
      axios
        .get(`http://localhost:8000/lawyer/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setLawyer(res.data))
        .catch((err) => console.error("Error fetching lawyer details:", err));
    }
  }, [id, lawyer]);

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (newStatus === "reject") {
        const res = await axios.patch(
          `http://localhost:8000/admin/lawyer-request/${id}/decline`,
          { reason: rejectReason }, // send reason only on reject
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        const res = await axios.patch(
          `http://localhost:8000/admin/lawyer-request/${id}/accept`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      setLawyer((prev) => ({
        ...prev,
        isLawyer: newStatus === "accept" ? "yes" : "no",
      }));
      setAccept(newStatus === "accept" ? " Lawyer request is accepted" : "");
      setReject(newStatus === "reject" ? " Lawyer request is rejected" : "");
      setShowRejectReason(false);
      setRejectReason("");
    } catch (err) {
      console.error("Failed to update lawyer status", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!lawyer)
    return <div className="pt-32 text-center text-gray-600">Loading...</div>;

  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen pt-28 bg-gradient-to-br from-green-100 to-green-50 px-4 py-12">
        <motion.div
          className="max-w-3xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-green-800 mb-8 animate-bounce text-center">
            👨‍⚖️ Lawyer Profile
          </h2>

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
              <span>
                {Array.isArray(lawyer.practiceAreas)
                  ? lawyer.practiceAreas.join(", ")
                  : lawyer.practiceAreas}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Experience:</span>
              <span>{lawyer.experience} years</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Application Status:</span>
              <span
                className={`font-bold animate-pulse ${
                  lawyer.isLawyer === "yes"
                    ? "text-green-600"
                    : lawyer.isLawyer === "no"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {lawyer.isLawyer || "pending"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Proof Files:</span>
              {Array.isArray(lawyer.proofFile) &&
                lawyer.proofFile.length > 0 && (
                  <div>
                    {lawyer.proofFile.map((file, idx) => (
                      <a
                        key={idx}
                        onClick={() =>
                          navigate("/admin/view-proof", {
                            state: { pdfUrl: file },
                          })
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        View Uploaded Proof{" "}
                        {lawyer.proofFile.length > 1 ? `#${idx + 1}` : ""}📄
                      </a>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Action Buttons */}

          <div className="mt-8 flex gap-4 justify-center">
            <button
              disabled={actionLoading || lawyer.isLawyer === "yes"}
              onClick={() => handleStatusUpdate("accept")}
              className="px-6 py-2 cursor-pointer bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              Accept
            </button>
            <button
              disabled={actionLoading || lawyer.isLawyer === "no"}
              onClick={() => setShowRejectReason(true)}
              className="px-6 py-2 cursor-pointer bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>
          {showRejectReason && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-col items-center"
            >
              <textarea
                rows="3"
                className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <button
                onClick={() => handleStatusUpdate("reject")}
                disabled={!rejectReason.trim() || actionLoading}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition disabled:opacity-50"
              >
                Submit Rejection
              </button>
            </motion.div>
          )}

          <div className="mt-8 flex justify-center">
            {accept && <p className="text-green-600 font-semibold">{accept}</p>}
            {reject && <p className="text-red-600 font-semibold">{reject}</p>}
          </div>
        </motion.div>
      </div>
    </>
  );
}
