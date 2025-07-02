import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { dashboardCards } from "./dashboardCards";
import { usePreventBackFromLawyerDashboard } from "../../components/usePreventBackFromDashboard";
import LawyerNavbar from "./LawyerNavbar";
export default function LawyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  {/* Redirect to dashboard if not already there */}
 
  usePreventBackFromLawyerDashboard();
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
        setMessage("Failed to fetch user requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);
  
  return (
    <div className="min-h-screen pt-28 px-6 py-10 bg-gradient-to-br from-blue-100 to-white-50">
      <LawyerNavbar/>
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          🧑‍⚖️ Lawyer Dashboard
        </h1>
        
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
                <strong>Email:</strong> {req.client?.email}
              </p>
              <p className="text-gray-700 text-sm mb-1">
                <strong>Message:</strong> {req.message}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Sent on: {new Date(req.createdAt).toLocaleString()}
              </p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
