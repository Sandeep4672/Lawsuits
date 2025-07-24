import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import Navbar from "./Navbar";
export default function AllLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/admin/lawyers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLawyers(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(lawyers.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedLawyers = lawyers.slice(startIndex, startIndex + limit);

  return (
    <>
    <Navbar/>
    
    <div className="min-h-screen pt-28 px-4 sm:px-8 pb-16 bg-gradient-to-br from-green-100 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer mb-6 flex items-center text-green-700 hover:text-green-900 transition font-medium"
        >
          <ArrowLeftCircle className="w-6 h-6 mr-2" />
          Back
        </button>

        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-green-800 mb-12">
          🧑‍⚖️ Verified Lawyers
        </h2>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-600 text-lg animate-pulse">
            Loading lawyers...
          </p>
        ) : lawyers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No verified lawyers found.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedLawyers.map((lawyer) => (
                <div
                  key={lawyer._id}
                  onClick={() =>
                    navigate(`/admin/verified-lawyer/${lawyer._id}`, {
                      state: { lawyer },
                    })
                  }
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border-t-4 border-green-500 hover:scale-[1.03] p-6"
                >
                  <h3 className="text-xl font-semibold text-green-800 mb-1">
                    {lawyer.fullName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{lawyer.email}</p>
                  <div className="text-sm text-gray-500">
                    <strong>Bar ID:</strong> {lawyer.barId}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <strong>Practice Areas:</strong>{" "}
                    {Array.isArray(lawyer.practiceAreas)
                      ? lawyer.practiceAreas.join(", ")
                      : lawyer.practiceAreas || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <strong>Experience:</strong> {lawyer.experience} years
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-700 hover:text-green-900"
                }`}
              >
                <ArrowLeftCircle className="w-5 h-5" />
                Previous
              </button>

              <span className="text-green-800 font-semibold">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
                  page === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-green-700 hover:text-green-900"
                }`}
              >
                Next
                <ArrowRightCircle className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
