import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeftCircle, MessageCircle } from "lucide-react";

export default function LawyerProfile() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();

  const defaultProfileImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-green-200 to-green-100">
        <div className="max-w-2xl mx-auto bg-amber-50 rounded-2xl shadow-lg p-8 relative">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer absolute top-6 left-6 text-green-700 hover:text-green-900 flex items-center"
          >
            <ArrowLeftCircle className="w-6 h-6 mr-1" />
            <span className="font-medium">Back</span>
          </button>

          {!lawyer ? (
            <div className="text-center text-gray-600 text-lg pt-12">
              Lawyer not found.
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={lawyer.profileImage || defaultProfileImage}
                  alt="Lawyer"
                  className="w-28 h-28 rounded-full border-4 border-green-300 shadow-md object-cover mb-4"
                />
                <h2 className="text-3xl font-bold text-center text-green-800">
                  👩‍⚖️ {lawyer.fullName}
                </h2>
              </div>

              <div className="space-y-4 text-lg text-gray-800">
                <div className="flex justify-between">
                  <span className="font-semibold">Email:</span>
                  <span>{lawyer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Bar ID:</span>
                  <span>{lawyer.barId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Phone:</span>
                  <span>{lawyer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Practice Areas:</span>
                  <span>
                    {Array.isArray(lawyer.practiceAreas)
                      ? lawyer.practiceAreas.join(", ")
                      : lawyer.practiceAreas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Experience:</span>
                  <span>{lawyer.experience} yrs</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() =>
                    navigate("/lawyer/request-connection", {
                      state: { lawyer },
                    })
                  }
                  className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow font-medium transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Request to Chat
                </button>
              </div>

             
            </>
          )}
        </div>
      </div>
    </>
  );
}
