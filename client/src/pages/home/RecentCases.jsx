import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
            "http://localhost:8000/user/history",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCases(response.data.data|| []);
        } catch (error) {
          console.error("Error fetching recent cases:", error);
        }
      };
      fetchRecentCases();
    }
  }, [isLoggedIn, navigate, token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-40 pb-20 px-6 sm:px-10 bg-[#0f172a] text-gray-200">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Recent Cases
        </h1>
        {cases.length > 0 ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            {cases.map((caseItem) => (
              <div
                key={caseItem._id}
                className="p-4 bg-white/10 backdrop-blur-md border border-gray-600 rounded-lg shadow-md"
              >
                <h2 className="text-xl font-semibold text-green-400">
                  {caseItem.caseId?.title || "Untitled Case"}
                </h2>
                <p className="text-gray-300 mt-2">
                  {caseItem.description || "No description available."}
                </p>
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