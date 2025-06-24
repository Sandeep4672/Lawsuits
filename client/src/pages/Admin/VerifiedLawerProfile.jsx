import React from "react";
import { useLocation } from "react-router-dom";

export default function VerifiedLawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;

  if (!lawyer) {
    return (
      <div className="pt-32 text-center text-gray-600">
        Lawyer details not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-green-100 to-green-50 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white border border-green-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          👨‍⚖️ Verified Lawyer Profile
        </h2>
        <div className="space-y-5 text-lg text-gray-800">
          <div className="flex justify-between">
            <span className="font-semibold">Full Name:</span>
            <span>{lawyer.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{lawyer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Bar Council ID:</span>
            <span>{lawyer.lawyerProfile?.barId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Practice Areas:</span>
            <span>
  {Array.isArray(lawyer.lawyerProfile?.practiceAreas)
    ? lawyer.lawyerProfile.practiceAreas.join(", ")
    : lawyer.lawyerProfile?.practiceAreas}
</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Experience:</span>
            <span>{lawyer.lawyerProfile?. experience} years</span>
          </div>
        </div>
      </div>
    </div>
  );
}