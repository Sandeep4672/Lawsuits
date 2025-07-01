import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { adminCards } from "./DashboardCards";
import { usePreventBackFromAdminDashboard } from "../../components/usePreventBackFromDashboard";
import Navbar from "./Navbar";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const cards = adminCards;

  

  usePreventBackFromAdminDashboard();

  return (
    <>
    <Navbar></Navbar>
   
    <div className=" min-h-screen pt-24 pb-16 px-6 bg-gradient-to-br from-slate-200 via-slate-100 to-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className={`p-6 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-200 bg-white hover:scale-[1.03] group`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold ${card.bg}`}
              >
                {card.icon}
              </div>
              <h2 className="text-xl font-semibold text-slate-800 group-hover:text-slate-900">
                {card.title}
              </h2>
            </div>
            <p className="text-slate-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
