import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function FindLawyer() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/user/find-lawyers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLawyers(res.data.data || []);
      } catch (err) {
        setMessage("Failed to fetch lawyers.");
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const handleConnect = (lawyer) => {
    navigate(`/lawyer-profile/${lawyer._id}`, {
      state: { lawyer },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-[#1e1e2f] text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-green-400 drop-shadow-md">
            👩‍⚖️ Verified Lawyers Directory
          </h2>

          {loading ? (
            <div className="text-center text-gray-400 text-lg">Loading...</div>
          ) : message ? (
            <div className="text-center text-red-500 font-semibold">{message}</div>
          ) : lawyers.length === 0 ? (
            <div className="text-center text-gray-400">No verified lawyers found.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg bg-[#2a2a3d]">
              <table className="min-w-full divide-y divide-gray-600 text-sm text-left">
                <thead className="bg-green-800 text-white font-semibold">
                  <tr>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Bar ID</th>
                    <th className="py-4 px-6">Practice Areas</th>
                    <th className="py-4 px-6">Experience</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {lawyers.map((lawyer) => (
                    <tr
                      key={lawyer._id}
                      className="hover:bg-green-950 transition-all duration-200"
                    >
                      <td className="px-6 py-4 font-medium text-gray-100">
                        {lawyer.fullName}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{lawyer.barId}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {Array.isArray(lawyer.practiceAreas)
                          ? lawyer.practiceAreas.join(", ")
                          : lawyer.practiceAreas ||
                            lawyer.lawyerProfile?.practiceAreas?.join(", ") ||
                            "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {lawyer.experience} yrs
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleConnect(lawyer)}
                          className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition font-semibold"
                        >
                          See Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
