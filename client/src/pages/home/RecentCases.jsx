import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RecentCases = () => {
  const [cases, setCases] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const fetchRecentCases = async () => {
        try {
          const response = await axios.get(
            "https://lawsuits.onrender.com/user/history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCases(response.data.data || []);
        } catch (error) {
          console.error("Error fetching recent cases:", error);
        }
      };
      fetchRecentCases();
    }
  }, [isLoggedIn, navigate, token]);

  const handleDelete = async (caseId, e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation
    try {
      await axios.delete(`https://lawsuits.onrender.com/user/history/${caseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCases((prev) => prev.filter((caseItem) => caseItem.caseId._id !== caseId));
    } catch (error) {
      console.error("Error deleting case history:", error);
    }
  };
  const handleClearHistory = async () => {
  try {
    await axios.delete("https://lawsuits.onrender.com/user/clear-history", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCases([]);
  } catch (error) {
    console.error("Error clearing case history:", error);
  }
};

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-40 pb-20 px-6 sm:px-10 bg-[#0f172a] text-gray-200">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Recent Cases
        </h1>
        {cases.length > 0 && (
        <div className="flex justify-end max-w-3xl mx-auto mb-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={handleClearHistory}
          >
            Clear History
          </button>
        </div>
      )}
        {cases.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {cases
              .filter((caseItem) => caseItem.caseId) // Filter out invalid
              .map((caseItem) => (
                <div
                  key={caseItem._id}
                  className="p-4 bg-white/10 backdrop-blur-md border border-gray-600 rounded-lg shadow-md flex justify-between items-center"
                >
                  <Link
                    to={`/case/${caseItem.caseId._id}`}
                    state={{ caseId: caseItem.caseId._id }}
                    className="flex-1"
                  >
                    <h2 className="text-xl font-semibold text-green-400">
                      {caseItem.caseId.title || "Untitled Case"}
                    </h2>
                  </Link>
                  <button
                    className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={(e) => handleDelete(caseItem.caseId._id, e)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-20 text-lg animate-pulse">
            No recent cases found.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RecentCases;