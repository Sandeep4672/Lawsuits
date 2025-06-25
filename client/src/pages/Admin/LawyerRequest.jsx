import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

export default function LawyerRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8000/admin/lawyer-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRequests(res.data.data || []);
      });
  }, []);

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-amber-100 to-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className=" cursor-pointer mb-6 flex items-center text-yellow-700 hover:text-yellow-900 transition"
        >
          <ArrowLeftCircle className="w-7 h-7 mr-2" />
          <span className="font-medium">Back</span>
        </button>

        <h2 className="text-3xl font-bold mb-8 text-yellow-700 text-center drop-shadow">
          📝 Pending Lawyer Applications
        </h2>

        {requests.length === 0 ? (
          <div className="text-center text-gray-600">
            No lawyer requests found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                onClick={() =>
                  navigate(`/admin/lawyer/${req._id}`, {
                    state: { lawyer: req },
                  })
                }
                className="p-5 bg-white border border-yellow-200 rounded-xl shadow hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  {req.fullName}
                </h3>
                <p className="text-gray-700 mb-1">
                  <strong>Email:</strong> {req.email}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Experience:</strong> {req.experience} yrs
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
