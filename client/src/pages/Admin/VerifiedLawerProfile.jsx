import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

export default function VerifiedLawyerDetails() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();
  const defaultProfileImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
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
    <div className="min-h-screen pt-28 pb-10 px-6 bg-gradient-to-br from-green-200 to-green-100">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8 relative transition-transform duration-300 hover:scale-[1.01]">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-green-800 mb-8 drop-shadow-md">
          👨‍⚖️ Verified Lawyer Profile
        </h2>

        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={lawyer.profileImage || defaultProfileImage}
            alt="profile-pic"
            className="w-24 h-24 rounded-full border-4 border-green-300 shadow-md"
          />
          <div>
            <h3 className="text-2xl font-semibold text-green-900">{lawyer.fullName}</h3>
            <p className="text-gray-600">{lawyer.email}</p>
            <p className="text-sm text-gray-500">{lawyer.phone || "Phone not provided"}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800 text-sm">
          <div className="bg-green-50 p-4 rounded-xl shadow-sm">
            <span className="block font-medium text-green-700 mb-1">Bar Council ID:</span>
            {lawyer.barId}
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow-sm">
            <span className="block font-medium text-green-700 mb-1">Experience:</span>
            {lawyer.experience} years
          </div>
          <div className="bg-green-50 p-4 rounded-xl shadow-sm col-span-1 sm:col-span-2">
            <span className="block font-medium text-green-700 mb-1">Practice Areas:</span>
            {Array.isArray(lawyer.practiceAreas)
              ? lawyer.practiceAreas.join(", ")
              : lawyer.practiceAreas || "N/A"}
          </div>
          {lawyer.proofFile && (
            <div className="bg-green-50 p-4 rounded-xl shadow-sm col-span-1 sm:col-span-2">
              <span className="block font-medium text-green-700 mb-1">Proof Document:</span>
              <a
                href={lawyer.proofFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Uploaded Proof 📄
              </a>
            </div>
          )}
        </div>

        {/* Back Button Bottom */}
        <div className="mt-10 text-center">
          {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer  flex items-center text-green-700 hover:text-green-900 transition"
          title="Back"
        >
          <ArrowLeftCircle className="w-6 h-6 mr-1" /> Back
        </button>
        </div>
      </div>
    </div>
  );
}
