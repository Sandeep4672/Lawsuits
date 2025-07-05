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
import ConsultationFeeCard from "./profileCards/Fee";
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

    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8000/lawyer/my-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;

        if (data) {
          setLawyer({
            fullName: data.lawyer?.fullName || "",
            email: data.lawyer?.email || "",
            practiceAreas: data.practiceAreas || [],
            experienceYears: data.experienceYears || "",
            barId: data.barId || "",
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
        console.error("Failed to fetch profile:", err);
        setMessage("Error loading profile.");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLawyer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("fullName", lawyer.fullName);
    formData.append("email", lawyer.email);
    formData.append("barId", lawyer.barId);
    formData.append("motto", lawyer.motto);
    formData.append("aboutMe", lawyer.aboutMe);
    formData.append("experienceYears", lawyer.experienceYears);
    formData.append("practiceAreas", JSON.stringify(lawyer.practiceAreas));
    formData.append("education", JSON.stringify(lawyer.education));
    formData.append("currentFirm", lawyer.currentFirm);
    formData.append("officeAddress", lawyer.officeAddress);
    formData.append(
      "courtAssociations",
      JSON.stringify(lawyer.courtAssociations)
    );
    formData.append("languagesSpoken", JSON.stringify(lawyer.languagesSpoken));
    formData.append("consultationFee", lawyer.consultationFee);
    formData.append("availability", JSON.stringify(lawyer.availability));
    formData.append("digitalPresence", JSON.stringify(lawyer.digitalPresence));
    formData.append("awards", JSON.stringify(lawyer.awards));
    formData.append("publications", JSON.stringify(lawyer.publications));

    if (profileImage) {
      formData.append("profilePicture", profileImage);
    }

    try {
      await axios.patch(
        "http://localhost:8000/lawyer/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
              <h1 className="text-5xl font-bold text-orange-400 mb-6">
                {lawyer.fullName}
              </h1>
              <img
                src={
                  imagePreview ||
                  lawyer?.profilePicture ||
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
                  experienceYears={lawyer.experienceYears}
                  editMode={editMode}
                  onChange={(e) =>
                    setLawyer((prev) => ({
                      ...prev,
                      experienceYears: e.target.value,
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
                  practiceAreas={lawyer.practiceAreas}
                  editMode={editMode}
                  onChange={(updatedPracticeAreas) =>
                    setLawyer((prev) => ({
                      ...prev,
                      practiceAreas: updatedPracticeAreas,
                    }))
                  }
                />

                <AwardsCard
                  awards={lawyer.awards}
                  editMode={editMode}
                  onChange={(updatedAwards) =>
                    setLawyer((prev) => ({ ...prev, awards: updatedAwards }))
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
                <DigitalLinksCard
                  digitalPresence={lawyer.digitalPresence}
                  editMode={editMode}
                  onChange={(field, value) =>
                    setLawyer((prev) => ({
                      ...prev,
                      digitalPresence: {
                        ...prev.digitalPresence,
                        [field]: value,
                      },
                    }))
                  }
                />
                <ConsultationFeeCard
                  consultationFee={lawyer.consultationFee}
                  editMode={editMode}
                  onChange={(value) =>
                    setLawyer((prev) => ({ ...prev, consultationFee: value }))
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
