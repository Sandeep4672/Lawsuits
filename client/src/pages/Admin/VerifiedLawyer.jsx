import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
export default function AllLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="pt-28 px-6 pb-10 bg-gradient-to-br from-green-100 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 cursor-pointer flex items-center text-green-700 hover:text-green-900 transition"
          title="Go back"
        >
          <ArrowLeftCircle className="w-7 h-7" /> Back
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                onClick={() =>
                  navigate(`/admin/verified-lawyer/${lawyer._id}`, {
                    state: { lawyer },
                  })
                }
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer border border-green-100 hover:border-green-300"
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
        )}
      </div>
    </div>
  );
}
