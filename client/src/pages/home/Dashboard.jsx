import React from "react";
import Navbar from "../../components/Navbar";
import DashboardTools from "../../components/User/DashboardTools";
import Footer from "../../components/Footer";
import { usePreventBackFromUserDashboard } from "../../components/usePreventBackFromDashboard";

export default function Dashboard() {
  usePreventBackFromUserDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white drop-shadow-md">
          ⚖️ LawSuits
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Choose a tool to begin your legal task. Analyze, draft, ask, extract, or translate.
        </p>

        <DashboardTools />
      </div>

      <Footer />
    </div>
  );
}
