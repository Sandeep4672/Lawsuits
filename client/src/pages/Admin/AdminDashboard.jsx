import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const cards = [
    {
      title: "All Verified Lawyers",
      description: "Browse through all verified lawyers",
      path: "/admin/lawyers",
      bg: "bg-green-200",
    },
    {
      title: "Pending Lawyer Requests",
      description: "View and approve new lawyer applications",
      path: "/admin/lawyer-requests",
      bg: "bg-yellow-200",
    },
    {
      title: "Add case",
      description: "Add legal case",
      path: "/admin/add-case",
      bg: "bg-gray-200",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-400 pt-24 px-6">
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white">
          ⚖️ Admin Panel
        </h1>
        <button
          onClick={handleLogout}
          className=" cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer p-6 rounded-xl shadow-md hover:shadow-xl transition-all ${card.bg}`}
          >
            <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
            <p className="text-gray-600 mt-2">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}