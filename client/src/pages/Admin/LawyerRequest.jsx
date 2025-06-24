import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LawyerRequests() {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token=localStorage.getItem("token");
    axios.get("http://localhost:8000/admin/lawyer-requests",{
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }).then((res) => {
      setRequests(res.data.lawyerProfiles);
    });
  }, []);

  return (
    <div className="pt-24 px-6 bg-gradient-to-br from-amber-100 to-amber-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-yellow-700">⏳ Lawyer Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.length === 0 ? (
          <div className="col-span-2 text-center text-gray-500">
            No lawyer requests found.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              onClick={() => navigate(`/admin/lawyer/${req._id}`,{state:{lawyer:req}})}
              className="p-4 bg-cyan-50 rounded-lg shadow hover:shadow-md cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{req.fullLawyerName}</h3>
              <p className="text-gray-600">{req.professionalEmail}</p>
              <p className="text-sm text-gray-500">Experience: {req.experience} yrs</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
