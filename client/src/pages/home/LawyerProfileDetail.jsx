// LawyerProfileDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Gavel,
  GraduationCap,
  IndianRupee,
  Languages,
  CalendarClock,
  BadgeCheck,
  Award,
  FileText,
  Landmark,
  Link as LinkIcon,
  Building2,
  MessageSquareText
} from "lucide-react";

export default function LawyerProfileDetails() {
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const lawyerId = location.state?.lawyerId;
  const Connected = location.state?.Connected;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `https://lawsuits.onrender.com/user/lawyer-profile/${lawyerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data.data;
        if (data) {
          setLawyer({
            _id: data.lawyer._id,
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

  const InfoCard = ({ title, icon: Icon, children, className = "" }) => (
    <div
      className={`hover:shadow-gray-600 bg-violet-700 p-6 rounded-xl border border-blue-500 shadow-xl backdrop-blur-md hover:scale-[1.02] transition-all ${className}`}
    >
      <h2 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
        <Icon className="w-5 h-5" /> {title}
      </h2>
      {children}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-gray-300 text-white">
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

              <p className="mt-4 text-lg text-gray-300">{lawyer.motto}</p>
              <p className="mt-4 max-w-2xl mx-auto text-sm text-gray-400">
                {lawyer.aboutMe}
              </p>

              <div className="mt-6 max-w-2xl mx-auto text-left space-y-4">
                <div>
                  <label className="block text-blue-600  font-bold mb-1">Full Name
                    <p className="text-gray-700">{lawyer.fullName}</p>
                  </label>
                  
                </div>
                <div>
                  <label className="block text-blue-600 font-bold mb-1">Email
                     <p className="text-gray-700">{lawyer.email}</p>
                  </label>
                 
                </div>
                <div>
                  <label className="block text-blue-600 font-bold mb-1">Bar ID <p className="text-gray-700">{lawyer.barId}</p></label>
                  
                </div>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => {
                    if (Connected) {
                      navigate("/chat/threads");
                    } else {
                      navigate("/lawyer/request-connection", {
                        state: { lawyer },
                      });
                    }
                  }}
                  className="cursor-pointer flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-lg font-medium transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  {Connected ? "Go to Chat" : "Request to Chat"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 text-left">
                <InfoCard title="Practice Areas" icon={Gavel}>
                  <div className="flex flex-wrap">
                    {lawyer.practiceAreas.map((area, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-blue-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard title="Publications" icon={FileText} >
                  <ul className="space-y-2 text-sm">
                    {lawyer.publications.map((pub, i) => (
                      <li key={i}>
                        <a href={pub.link} className="text-blue-300 underline">
                          {pub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </InfoCard>

                <InfoCard title="Languages Spoken" icon={Languages}>
                  <div className="flex flex-wrap">
                    {lawyer.languagesSpoken.map((lang, i) => (
                      <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm mr-2 mb-2">
                        {lang}
                      </span>
                    ))}
                  </div>
                </InfoCard>

                <InfoCard title="Education" icon={GraduationCap}>
                  {lawyer.education.map((edu, i) => (
                    <div key={i} className="mb-4 border-b border-gray-700 pb-2 text-sm">
                      <p><strong>Degree:</strong> {edu.degree}</p>
                      <p><strong>University:</strong> {edu.university}</p>
                      <p><strong>Graduation Year:</strong> {edu.graduationYear}</p>
                    </div>
                  ))}
                </InfoCard>

                <InfoCard title="Consultation Fee" icon={IndianRupee} >
                  <p className="text-white text-sm">₹ {lawyer.consultationFee || "Not specified"}</p>
                </InfoCard>

                <InfoCard title="Experience" icon={BadgeCheck}>
                  <p>{lawyer.experienceYears} years</p>
                </InfoCard>

                <InfoCard title="Digital Presence" icon={LinkIcon}>
                  <ul className="text-sm text-white space-y-1">
                    {lawyer.digitalPresence.linkedin && (
                      <li>
                        LinkedIn: <a href={lawyer.digitalPresence.linkedin} className="text-cyan-400">{lawyer.digitalPresence.linkedin}</a>
                      </li>
                    )}
                    {lawyer.digitalPresence.website && (
                      <li>
                        Website: <a href={lawyer.digitalPresence.website} className="text-cyan-400">{lawyer.digitalPresence.website}</a>
                      </li>
                    )}
                    {lawyer.digitalPresence.barAssociationProfile && (
                      <li>
                        Bar Profile: <a href={lawyer.digitalPresence.barAssociationProfile} className="text-cyan-400">{lawyer.digitalPresence.barAssociationProfile}</a>
                      </li>
                    )}
                  </ul>
                </InfoCard>

                <InfoCard title="Availability" icon={CalendarClock} >
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
                </InfoCard>

                <InfoCard title="Awards" icon={Award}>
                  <ul className="text-sm text-white">
                    {lawyer.awards.map((award, i) => (
                      <li key={i}>{award.title} ({award.year})</li>
                    ))}
                  </ul>
                </InfoCard>

                <InfoCard title="Court Associations" icon={Landmark}>
                  <ul className="text-sm list-disc pl-5">
                    {lawyer.courtAssociations.map((court, i) => (
                      <li key={i}>{court}</li>
                    ))}
                  </ul>
                </InfoCard>

                <InfoCard title="Firm & Address" icon={Building2} >
                  <p className="text-sm text-gray-200">
                    {lawyer.currentFirm || "N/A"} <br />
                    {lawyer.officeAddress || "No address provided."}
                  </p>
                </InfoCard>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
