import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "./LawyerNavbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import ExperienceCard from "./profileCards/Experience";
import AwardsCard from "./profileCards/Awards";
import EducationCard from "./profileCards/Education";
import DigitalLinksCard from "./profileCards/DigitalLinks";
import LanguagesCard from "./profileCards/Language";
import SpecializationsCard from "./profileCards/Specialization";
import PublicationsCard from "./profileCards/Publication";
import AvailabilityCard from "./profileCards/Avalability";
import CourtAssociationsCard from "./profileCards/CourtAssociation.";
import FirmDetailsCard from "./profileCards/Firmdetails";
export default function MyProfile() {
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [profileData, setProfileData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      const res = axios.get(`http://localhost:8000/lawyer/profile-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(res.data.data || []);
    } catch (err) {}

    if (token) {
      const decoded = jwtDecode(token);
      setLawyer({
        fullName: decoded.fullName || "",
        email: decoded.email || "",
        specialization: decoded.practiceAreas || [
          "murder",
          "education",
          "Civil Law",
          "Corporate Law",
        ],
        experience: decoded.experience || "9",
        barId: decoded.barId || "12345",
        motto: decoded.motto || "Passionate Advocate for Justice",
        aboutMe:
          decoded.aboutMe ||
          "Dedicated to delivering ethical and effective legal counsel.",
        education: decoded.education || [
          {
            degree: "graduate",
            university: "GMU",
            graduationYear: 2024,
            certificateUrl: "huh ddidididj",
          },
          {
            degree: "PG",
            university: "DU",
            graduationYear: 2024,
            certificateUrl: "13554545",
          },
        ],
        currentFirm: decoded.currentFirm || "",
        officeAddress: decoded.officeAddress || "",
        courtAssociations: decoded.courtAssociations || [],
        languagesSpoken: decoded.languagesSpoken || ["english", "hindi"],
        consultationFee: decoded.consultationFee || "12000",
        availability: decoded.availability || {
          days: ["Monday", "Wednesday", "Friday"],
          timeSlots: [
            { start: "10:00", end: "13:00" },
            { start: "16:00", end: "18:00" },
          ],
        },
        digitalPresence: decoded.digitalPresence || {
          linkedin: "https://linkedin.com/in/johndoe",
          website: "https://johndoelaw.com",
          barAssociationProfile: "https://barassociation.com/johndoe",
        },
        awards: decoded.awards || [
          { title: "Best Corporate Litigator", year: 2020 },
          { title: "Human Rights Defender Award", year: 2022 },
        ],
        publications: decoded.publications || [
          {
            title: "Corporate Ethics in Indian Law",
            link: "https://legaljournals.com/corporate-ethics",
          },
          {
            title: "Protecting Civil Liberties",
            link: "https://lawreview.org/civil-liberties",
          },
        ],
      });
      setLoading(false);
    } else {
      setMessage("You are not logged in.");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLawyer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8000/lawyers/updateProfile", lawyer);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const renderCard = (title, content) => (
    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-blue-400">
      <h2 className="text-lg font-semibold text-blue-400 mb-2">{title}</h2>
      {content}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-black text-white">
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
              <h1 className="text-5xl font-bold text-orange-400 mb-6">
                {lawyer.fullName}
              </h1>
              <img
                src={
                  imagePreview ||
                  "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-orange-500 object-cover mx-auto"
              />
              {editMode && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-2 text-sm text-gray-300"
                />
              )}
              <div className="mt-4 text-lg text-gray-300">
                {editMode ? (
                  <input
                    type="text"
                    name="motto"
                    value={lawyer.motto}
                    onChange={handleInputChange}
                    className="bg-gray-700 px-4 py-2 rounded w-3/4"
                  />
                ) : (
                  <p>{lawyer.motto}</p>
                )}
              </div>
              <p className="mt-4 max-w-2xl mx-auto text-sm text-gray-400">
                {editMode ? (
                  <textarea
                    name="aboutMe"
                    value={lawyer.aboutMe}
                    onChange={handleInputChange}
                    className="bg-gray-800 px-4 py-2 rounded w-full"
                    rows={4}
                  />
                ) : (
                  lawyer.aboutMe
                )}
              </p>

              <div className="mt-6 max-w-2xl mx-auto text-left space-y-4">
                <div>
                  <label className="block text-orange-300 font-medium mb-1">
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={lawyer.fullName}
                      onChange={handleInputChange}
                      className="bg-gray-800 px-4 py-2 w-full rounded"
                    />
                  ) : (
                    <p>{lawyer.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-orange-300 font-medium mb-1">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={lawyer.email}
                      onChange={handleInputChange}
                      className="bg-gray-800 px-4 py-2 w-full rounded"
                    />
                  ) : (
                    <p>{lawyer.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-orange-300 font-medium mb-1">
                    Bar ID
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="barId"
                      value={lawyer.barId}
                      onChange={handleInputChange}
                      className="bg-gray-800 px-4 py-2 w-full rounded"
                    />
                  ) : (
                    <p>{lawyer.barId}</p>
                  )}
                </div>
              </div>

              <div className="text-center mt-10">
                <button
                  onClick={editMode ? handleSave : () => setEditMode(true)}
                  className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  {editMode ? "Save Changes" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 text-left">
                <ExperienceCard
                  experience={lawyer.experience}
                  editMode={editMode}
                  onChange={(e) =>
                    setLawyer((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                />
                <EducationCard
                  education={lawyer.education}
                  editMode={editMode}
                  onChange={(updatedEducation) =>
                    setLawyer((prev) => ({
                      ...prev,
                      education: updatedEducation,
                    }))
                  }
                />

                <SpecializationsCard
                  specialization={lawyer.specialization}
                  editMode={editMode}
                  onChange={(e) =>
                    setLawyer((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                />
                <AwardsCard
                  awards={lawyer.awards}
                  editMode={editMode}
                  onChange={(e) =>
                    setLawyer((prev) => ({ ...prev, awards: e.target.value }))
                  }
                />

                <LanguagesCard
                  languages={lawyer.languagesSpoken}
                  editMode={editMode}
                  onChange={(updatedLanguages) =>
                    setLawyer((prev) => ({
                      ...prev,
                      languagesSpoken: updatedLanguages,
                    }))
                  }
                />
                <PublicationsCard
                  publications={lawyer.publications}
                  editMode={editMode}
                  onChange={(updatedPublications) =>
                    setLawyer((prev) => ({
                      ...prev,
                      publications: updatedPublications,
                    }))
                  }
                />
                <AvailabilityCard
                  availability={lawyer.availability}
                  editMode={editMode}
                  onChange={(updatedAvailability) =>
                    setLawyer((prev) => ({
                      ...prev,
                      availability: updatedAvailability,
                    }))
                  }
                />
                <CourtAssociationsCard
                  associations={lawyer.courtAssociations}
                  editMode={editMode}
                  onChange={(updated) =>
                    setLawyer((prev) => ({
                      ...prev,
                      courtAssociations: updated,
                    }))
                  }
                />
                <FirmDetailsCard
                  firm={lawyer.currentFirm}
                  address={lawyer.officeAddress}
                  editMode={editMode}
                  onChange={(key, value) =>
                    setLawyer((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
