import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./LawyerNavbar";

export default function AcceptedConnections() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/lawyer/connections/accepted",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequests(res.data.data || []);
      } catch (err) {
        setMessage("Failed to fetch accepted connections.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700 transition-all">
        <h2 className="text-2xl font-bold text-blue-400 mb-6 text-center">
          ✅ User Accepted Connections
        </h2>

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : message ? (
          <div className="text-center text-red-400">{message}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-500">
            No accepted connections found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700 text-sm text-left">
              <thead className="bg-gray-700 text-blue-200">
                <tr>
                  <th className="py-3 px-6">Client Name</th>
                  <th className="py-3 px-6">Subject</th>
                  <th className="py-3 px-6">Message</th>
                  <th className="py-3 px-6">Document</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Requested At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <td className="px-6 py-3">
                      {req.client?.fullName || "N/A"}
                    </td>
                    <td className="px-6 py-3">{req.subject}</td>
                    <td className="px-6 py-3">{req.message}</td>
                    <td className="px-6 py-3">
                      {req.documents && req.documents.length > 0 ? (
                        <a
                          href={req.documents[0].secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "No Document"
                      )}
                    </td>
                    <td className="px-6 py-3 capitalize">{req.status}</td>
                    <td className="px-6 py-3">
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
