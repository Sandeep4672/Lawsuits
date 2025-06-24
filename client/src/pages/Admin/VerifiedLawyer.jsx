import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8000/admin/lawyers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setLawyers(res.data.verifiedLawyers);
    });
  }, []);

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-green-100 to-green-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-green-700">✔ Verified Lawyers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lawyers.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500">
            No verified lawyers found.
          </div>
        ) : (
          lawyers.map((lawyer) => (
            <div
              key={lawyer._id}
              onClick={() => navigate(`/admin/verified-lawyer/${lawyer._id}`, { state: { lawyer } })}
              className="p-4 bg-green-50 rounded-lg shadow hover:shadow-md cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{lawyer.fullName}</h3>
              <p className="text-gray-600">{lawyer.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}