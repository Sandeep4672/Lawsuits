import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { dashboardCards } from "./dashboardCards";
import { usePreventBackFromLawyerDashboard } from "../../components/usePreventBackFromDashboard";
import LawyerNavbar from "./LawyerNavbar";

export default function LawyerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { logout } = useContext(AuthContext);

  usePreventBackFromLawyerDashboard();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:8000/lawyer/connections/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-28 px-6 py-10">
      <LawyerNavbar />

      <motion.div
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          🧑‍⚖️ Lawyer Dashboard
        </h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        {dashboardCards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, scale: 0.95, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            <Link to={card.to}>
              <div className="bg-gray-700 border border-transparent hover:border-blue-500 hover:shadow-[0_0_15px_#3b82f6] rounded-xl p-6 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center">
                <div className="text-3xl mb-3 text-blue-300">{card.icon}</div>
                <p className="text-blue-200 font-medium text-center">
                  {card.label}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Requests Section */}
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          📥 User Contact Requests
        </h2>

        {message && (
          <p className="text-center text-sm text-red-400 mb-4">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-500">No pending user requests.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((req, idx) => (
              <motion.div
                key={req._id}
                className="bg-gray-800 border-l-4 border-blue-500 rounded-xl p-5 shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  {req.userName}
                </h3>
                <p className="text-gray-300 text-sm mb-1">
                  <strong>Email:</strong> {req.client?.email}
                </p>
                <p className="text-gray-300 text-sm mb-1">
                  <strong>Message:</strong> {req.message}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Sent on: {new Date(req.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
