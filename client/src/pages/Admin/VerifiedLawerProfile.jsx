import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifiedLawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600 text-lg animate-pulse">
          ⚠️ Lawyer details not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-green-100 to-white px-4 py-10 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-white border border-green-200 rounded-2xl shadow-xl p-8 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8 animate-fade-down">
          👨‍⚖️ Verified Lawyer Profile
        </h2>

        <div className="space-y-6 text-gray-800">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Full Name:</span>
            <span>{lawyer.fullName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email:</span>
            <span>{lawyer.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Phone:</span>
            <span>{lawyer.phone || "Not Provided"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Bar Council ID:</span>
            <span>{lawyer.barId}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Practice Areas:</span>
            <span>
              {Array.isArray(lawyer.practiceAreas)
                ? lawyer.practiceAreas.join(", ")
                : lawyer.practiceAreas || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Experience:</span>
            <span>{lawyer.experience} years</span>
          </div>

          {lawyer.proofFile && (
            <div className="flex justify-between items-center pt-4">
              <span className="font-semibold">Proof Document:</span>
              <a
                href={lawyer.proofFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Proof
              </a>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className=" cursor-pointer px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}
