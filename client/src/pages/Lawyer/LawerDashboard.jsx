import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { dashboardCards } from "./dashboardCards";
export default function LawyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/lawyer/connections/requests", {
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

  const handleLogout = () => {
    logout();
    navigate("/lawyer-login");
  };

  return (
    <div className="min-h-screen pt-28 px-6 py-10 bg-gradient-to-br from-blue-200 to-blue-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          🧑‍⚖️ Lawyer Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="hover:scale-[1.03] cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
        >
          Logout
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto">
        {dashboardCards.map((card, idx) => (
          <Link to={card.to} key={idx}>
            <div
              className={`flex flex-col items-center justify-center bg-white shadow-md hover:shadow-xl border border-gray-200 hover:border-blue-400 rounded-xl p-6 transition-transform duration-300 hover:scale-[1.03] ${card.borderColor}`}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <p className="text-blue-800 font-semibold text-center">
                {card.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Requests section */}
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        📥 User Contact Requests
      </h2>

      {message && <p className="text-center text-sm text-red-600">{message}</p>}

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
  );
}
