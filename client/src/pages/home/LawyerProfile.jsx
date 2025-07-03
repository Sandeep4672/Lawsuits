import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { ArrowLeftCircle, MessageCircle } from "lucide-react";
import Footer from "../../components/Footer";
export default function LawyerProfile() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();

  const defaultProfileImage =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-[#1e1e2f] text-white">
        <div className="max-w-2xl mx-auto bg-[#2a2a3d] rounded-2xl shadow-lg p-8 relative border border-green-900">
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer absolute top-6 left-6 text-green-400 hover:text-green-200 flex items-center transition-all"
          >
            <ArrowLeftCircle className="w-6 h-6 mr-1" />
            <span className="font-medium">Back</span>
          </button>

          {!lawyer ? (
            <div className="text-center text-gray-300 text-lg pt-12">
              Lawyer not found.
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <img
                  src={lawyer.profileImage || defaultProfileImage}
                  alt="Lawyer"
                  className="w-28 h-28 rounded-full border-4 border-green-400 shadow-md object-cover mb-4"
                />
                <h2 className="text-3xl font-bold text-center text-green-400">
                  👩‍⚖️ {lawyer.fullName}
                </h2>
              </div>

              <div className="space-y-4 text-lg text-gray-300">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Email:</span>
                  <span>{lawyer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Bar ID:</span>
                  <span>{lawyer.barId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Phone:</span>
                  <span>{lawyer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Practice Areas:</span>
                  <span>
                    {Array.isArray(lawyer.practiceAreas)
                      ? lawyer.practiceAreas.join(", ")
                      : lawyer.practiceAreas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-400">Experience:</span>
                  <span>{lawyer.experience} yrs</span>
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() =>
                    navigate("/lawyer/request-connection", {
                      state: { lawyer },
                    })
                  }
                  className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-lg font-medium transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  Request to Chat
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
