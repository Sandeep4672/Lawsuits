import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { useLocation,useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function LawyerProfileDetails() {
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate=useNavigate();
 const [imagePreview, setImagePreview] = useState(null);
  const {state}=useLocation();
  const location=useLocation();
  const lawyerId=location.state?.lawyerId;
   const Connected=location.state?.Connected;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/lawyer-profile/${lawyerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.data;
        console.log(data);
        if (data) {
          setLawyer({
            fullName: data.lawyer?.fullName || "",
            email: data.lawyer?.email || "",
            barId: data.lawyer?.barId || "",
            practiceAreas: data.practiceAreas || [],
            experienceYears: data.experienceYears || "",
            motto: data.motto || "",
            aboutMe: data.aboutMe || "",
            education: data.education || [],
            currentFirm: data.currentFirm || "",
            officeAddress: data.officeAddress || "",
            courtAssociations: data.courtAssociations || [],
            languagesSpoken: data.languagesSpoken || [],
            consultationFee: data.consultationFee || "",
            availability: data.availability || {},
            digitalPresence: data.digitalPresence || {},
            awards: data.awards || [],
            publications: data.publications || [],
            profilePicture: data?.profilePicture || "",
          });

          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setMessage("Error loading profile data.");
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setMessage("You are not logged in.");
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {loading ? (
            <p className="text-gray-300">Loading...</p>
          ) : message ? (
            <p className="text-red-500">{message}</p>
          ) : (
            <div className="text-center">
              <h1 className="text-5xl font-bold text-blue-600 mb-6">
                {lawyer.fullName}
              </h1>
              <img
                src={
                  imagePreview ||
                  lawyer?.profilePicture ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover mx-auto"
              />

              <div className="mt-4 text-lg text-gray-300">
                <p>{lawyer.motto}</p>
              </div>
              <p className="mt-4 max-w-2xl mx-auto text-sm text-gray-400">
                {lawyer.aboutMe}
              </p>

              <div className="mt-6 max-w-2xl mx-auto text-left space-y-4">
                <div>
                  <label className="block text-green-400 font-medium mb-1">
                    Full Name
                  </label>
                  <p>{lawyer.fullName}</p>
                </div>
                <div>
                  <label className="block text-green-400  font-medium mb-1">
                    Email
                  </label>
                  <p>{lawyer.email}</p>
                </div>
                <div>
                  <label className="block text-green-400 font-medium mb-1">
                    Bar ID
                  </label>
                  <p>{lawyer.barId}</p>
                </div>
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => {
                    if (Connected) {
                      navigate("/chat/threads", {
                        // state: { lawyer },
                      });
                    } else {
                      navigate("/lawyer/request-connection", {
                        state: { lawyer },
                      });
                    }
                  }}
                  className="cursor-pointer flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-lg font-medium transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  {Connected ? "Go to Chat" : "Request to Chat"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 text-left ">
                {/* Practice Areas */}
                <div className=" hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Practice Areas
                  </h2>
                  <div className="flex flex-wrap">
                    {lawyer.practiceAreas.map((area, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Publications */}
                <div className=" hover:shadow-blue-400 bg-white/10 p-6 rounded-xl border border-green-600 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-500 mb-2">
                    Publications
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {lawyer.publications.map((pub, i) => (
                      <li key={i}>
                        <a href={pub.link} className="text-blue-300 underline">
                          {pub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Languages */}
                <div className="  hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Languages Spoken
                  </h2>
                  <div className="flex flex-wrap">
                    {lawyer.languagesSpoken.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-4">
                    Education
                  </h2>
                  {lawyer.education.map((entry, index) => (
                    <div key={index} className="mb-4 border-b border-gray-700 pb-2 text-sm">
                      <p><strong>Degree:</strong> {entry.degree}</p>
                      <p><strong>University:</strong> {entry.university}</p>
                      <p><strong>Graduation Year:</strong> {entry.graduationYear}</p>
                    </div>
                  ))}
                </div>

                {/* Consultation Fee */}
                <div className="hover:shadow-blue-400 bg-white/10 p-6 rounded-xl border border-green-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Consultation Fee
                  </h2>
                  <p className="text-white text-sm">
                    ₹ {lawyer.consultationFee || "Not specified"}
                  </p>
                </div>

                {/* Experience */}
                <div className="hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Experience
                  </h2>
                  <p>{lawyer.experienceYears} years</p>
                </div>

                {/* Digital Presence */}
                <div className="hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Digital Links
                  </h2>
                  <ul className="text-sm text-white">
                    {lawyer.digitalPresence.linkedin && (
                      <li >LinkedIn: <a href={lawyer.digitalPresence.linkedin} className="text-cyan-400">{lawyer.digitalPresence.linkedin}</a></li>
                    )}
                    {lawyer.digitalPresence.website && (
                      <li className="mt-5">Website: <a href={lawyer.digitalPresence.website} className="text-cyan-400">{lawyer.digitalPresence.website}</a></li>
                    )}
                    {lawyer.digitalPresence.barAssociationProfile && (
                      <li className="mt-5">
                        Bar Profile: <a href={lawyer.digitalPresence.barAssociationProfile} className="text-cyan-400">{lawyer.digitalPresence.barAssociationProfile}</a> 
                      </li>
                    )}
                  </ul>
                </div>

                {/* Availability */}
                <div className="hover:shadow-blue-400 bg-white/10 p-6 rounded-xl border border-green-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Availability
                  </h2>
                  {lawyer.availability?.days?.length > 0 && (
                    <p className="text-sm">Days: {lawyer.availability.days.join(", ")}</p>
                  )}
                  {lawyer.availability?.timeSlots?.length > 0 && (
                    <ul className="text-sm mt-1">
                      {lawyer.availability.timeSlots.map((slot, i) => (
                        <li key={i}>{slot.start} - {slot.end}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Awards */}
                <div className="hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-4">
                    Awards
                  </h2>
                  <ul className="text-sm text-white">
                    {lawyer.awards.map((award, i) => (
                      <li key={i}>
                        {award.title} ({award.year})
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Court Associations */}
                <div className="hover:shadow-green-400 bg-black p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Court Associations
                  </h2>
                  <ul className="text-sm list-disc pl-5">
                    {lawyer.courtAssociations.map((court, i) => (
                      <li key={i}>{court}</li>
                    ))}
                  </ul>
                </div>

                {/* Firm & Address */}
                <div className="hover:shadow-blue-400 bg-white/10 p-6 rounded-xl border border-green-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all">
                  <h2 className="text-lg font-semibold text-green-400 mb-2">
                    Current Firm & Address
                  </h2>
                  <p className="text-sm text-gray-200">
                    {lawyer.currentFirm || "N/A"} <br />
                    {lawyer.officeAddress || "No address provided."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
