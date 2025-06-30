import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

export default function AllLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6; // Number of cards per page
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
    <div className="pt-28 px-6 pb-10 bg-gradient-to-br from-green-200 to-green-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 cursor-pointer flex items-center text-red-700 hover:text-red-900 transition"
          title="Go back"
        >
          <ArrowLeftCircle className="w-7 h-7 mr-1" /> Back
        </button>

        <h2 className="text-3xl font-bold text-center text-green-800 mb-10 drop-shadow-md">
          🧑‍⚖️ All Verified Lawyers
        </h2>

        {loading ? (
          <div className="text-center text-gray-600 text-lg animate-pulse">
            Loading lawyers...
          </div>
        ) : lawyers.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No verified lawyers found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedLawyers.map((lawyer) => (
                <div
                  key={lawyer._id}
                  onClick={() =>
                    navigate(`/admin/verified-lawyer/${lawyer._id}`, {
                      state: { lawyer },
                    })
                  }
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer border border-green-100 hover:border-green-300 hover:scale-[1.05] transform"
                >
                  <h3 className="text-xl font-semibold text-green-700 mb-1">
                    {lawyer.fullName}
                  </h3>
                  <p className="text-gray-600 text-sm">{lawyer.email}</p>
                  <div className="mt-3 text-sm text-gray-500">
                    <span className="font-medium">Bar ID:</span> {lawyer.barId}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Practice:</span>{" "}
                    {Array.isArray(lawyer.practiceAreas)
                      ? lawyer.practiceAreas.join(", ")
                      : lawyer.practiceAreas || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Experience:</span>{" "}
                    {lawyer.experience} years
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded  text-red-600 cursor-pointer hover:text-red-800 flex items-center gap-2"
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
                className="px-4 py-2 rounded  text-red-600 cursor-pointer hover:text-red-800 flex items-center gap-2"
              >
                Next
                <ArrowRightCircle className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
