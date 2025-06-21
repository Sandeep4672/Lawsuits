import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-400 pt-24 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        ⚖️ Admin Panel
      </h1>

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
