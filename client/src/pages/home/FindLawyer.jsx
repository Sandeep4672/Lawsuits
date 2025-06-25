import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

export default function FindLawyer() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/home/find-lawyers", {
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
    alert(`Connect request sent to ${lawyer.fullName || lawyer.fullLawyerName}`);
  };

  return (
    <>
    <Navbar></Navbar>
    
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-green-200 to-greean-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-800 drop-shadow-md">
          👩‍⚖️ Verified Lawyers Directory
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : message ? (
          <div className="text-center text-red-600 font-semibold">{message}</div>
        ) : lawyers.length === 0 ? (
          <div className="text-center text-gray-600">No verified lawyers found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-blue-100 text-blue-800 font-semibold">
                <tr>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Bar ID</th>
                  <th className="py-4 px-6">Practice Areas</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">See Proof File</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lawyers.map((lawyer) => (
                  <tr
                    key={lawyer._id}
                    className="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {lawyer.fullName }
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lawyer.email }
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lawyer.phone }
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lawyer.barId }
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Array.isArray(lawyer.practiceAreas)
                        ? lawyer.practiceAreas.join(", ")
                        : lawyer.practiceAreas ||
                          lawyer.lawyerProfile?.practiceAreas?.join(", ") ||
                          "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {lawyer.experience} yrs
                    </td>
                    <td className="px-6 py-4">
                      {lawyer.proofFile ? (
                        <a
                          href={lawyer.proofFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-red-600 cursor-pointer"
                        >
                          View Proof
                        </a>
                      ) : (
                        "N/A"
                      )}
                      </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleConnect(lawyer)}
                        className=" cursor-pointer bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded-md transition font-semibold"
                      >
                        Connect
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
