import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
export default function LawyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/lawyer/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data.requests || []);
      } catch (err) {
        setMessage("Failed to fetch user requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8000/lawyer/requests/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests((prev) => prev.filter((request) => request._id !== id));
      setMessage(`Request ${action}ed successfully.`);
    } catch {
      setMessage(`Failed to ${action} request.`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-6 py-10 bg-gradient-to-br from-blue-200 to-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🧑‍⚖️ Lawyer Dashboard
        </h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Link to="/lawyer/requests">
            <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-6 text-center cursor-pointer border-t-4 border-blue-600 hover:scale-[1.05] transform duration-200">
              <h2 className="text-2xl font-bold text-blue-700">12</h2>
              <p className="text-gray-600 mt-1 font-medium">Pending Requests</p>
            </div>
          </Link>

          <Link to="/lawyer/appointments">
            <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-6 text-center cursor-pointer border-t-4 border-green-600 hover:scale-[1.05] transform duration-200">
              <h2 className="text-2xl font-bold text-green-700">8</h2>
              <p className="text-gray-600 mt-1 font-medium">Appointments</p>
            </div>
          </Link>

          <Link to="/lawyer/messages">
            <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-6 text-center cursor-pointer border-t-4 border-yellow-500 hover:scale-[1.05] transform duration-200">
              <h2 className="text-2xl font-bold text-yellow-600">5</h2>
              <p className="text-gray-600 mt-1 font-medium">Messages</p>
            </div>
          </Link>

          <Link to="/lawyer/cases">
            <div className="bg-white shadow-lg hover:shadow-xl transition rounded-2xl p-6 text-center cursor-pointer border-t-4 border-purple-600 hover:scale-[1.05] transform duration-200">
              <h2 className="text-2xl font-bold text-purple-700">3</h2>
              <p className="text-gray-600 mt-1 font-medium">Case Uploads</p>
            </div>
          </Link>
        </div>

        {/* Requests section */}
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          📥 User Contact Requests
        </h2>

        {message && (
          <p className="text-center text-sm text-red-600">{message}</p>
        )}

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No pending user requests.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-blue-600"
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  {req.userName}
                </h3>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Email:</strong> {req.userEmail}
                </p>
                <p className="text-gray-700 text-sm mb-1">
                  <strong>Message:</strong> {req.message}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Sent on: {new Date(req.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAction(req._id, "accept")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
