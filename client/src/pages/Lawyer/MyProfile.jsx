import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./LawyerNavbar";

export default function MyProfile() {
  const [lawyer, setLawyer] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLawyerProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/lawyer/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLawyer(res.data.data || {});
      } catch (err) {
        setMessage("Failed to fetch lawyer profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerProfile();
  }, []);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-blue-100 to-white-50">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : message ? (
          <p className="text-red-500">{message}</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="mb-4">
              <strong>Name:</strong> {lawyer.fullName || lawyer.username}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {lawyer.email}
            </div>
            <div className="mb-4">
              <strong>Specialization:</strong> {lawyer.specialization}
            </div>
            <div className="mb-4">
              <strong>Experience:</strong> {lawyer.experience} years
            </div>
          </div>
        )}
      </div>
    </div>
  );
}