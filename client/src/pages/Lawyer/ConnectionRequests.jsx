import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./LawyerNavbar";

export default function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/lawyer/connections/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.data || []);
      } catch (err) {
        setMessage("Failed to fetch connection requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
const handleAction = async (id, action) => {
  try {
    const token = localStorage.getItem("token");
    if (action === "accept") {
      await axios.patch(
        `http://localhost:8000/lawyer/connections/requests/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else if (action === "reject") {
      await axios.delete(
        `http://localhost:8000/lawyer/connections/requests/${id}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    setRequests((prev) => prev.filter((req) => req._id !== id));
    setMessage(`Request ${action}ed successfully.`);
  } catch (err) {
    setMessage(`Failed to ${action} request.`);
  }
};
  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-blue-100 to-white-50">
     <Navbar/>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          📥 User Connection Requests
        </h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : message ? (
          <div className="text-center text-red-600">{message}</div>
        ) : requests.length === 0 ? (
          <div className="text-center text-gray-600">No connection requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-blue-100 text-blue-800 font-semibold">
                <tr>
                  <th className="py-3 px-6">Client Name</th>
                  <th className="py-3 px-6">Subject</th>
                  <th className="py-3 px-6">Message</th>
                  <th className="py-3 px-6">Document</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Requested At</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-blue-50 transition-all duration-200">
                    <td className="px-6 py-3">{req.client?.fullName || "N/A"}</td>
                    <td className="px-6 py-3">{req.subject}</td>
                    <td className="px-6 py-3">{req.message}</td>
                    <td className="px-6 py-3">
                      {req.documents && req.documents.length > 0 ? (
                        <a
                          href={req.documents[0].secure_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
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
                    <td className="px-6 py-3 flex gap-2">
                      <button
                         onClick={() => handleAction(req._id, "accept")}
                        className=" cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req._id, "reject")}
                        className=" cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Reject
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
  );
}