import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";

export default function ConnectionRequestForm() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!lawyer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#1e1e2f]">
          <div className="text-red-400 text-lg font-semibold">
            No lawyer selected.
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      if (file) formData.append("documents", file);

      await axios.post(
        `http://localhost:8000/user/connect/${lawyer._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus("✅ Request sent successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setStatus(err.response?.data?.message || "❌ Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-[#1e1e2f] flex items-center justify-center">
        <form
          className="bg-[#2a2a3d] text-white rounded-2xl shadow-lg p-8 max-w-lg w-full space-y-6 border border-green-800"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-green-400 mb-4 text-center">
            Request to Chat with {lawyer.fullName}
          </h2>

          <div>
            <label className="block font-medium mb-1 text-gray-300">
              Subject
            </label>
            <input
              type="text"
              className="w-full bg-[#1e1e2f] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              minLength={5}
              placeholder="Enter subject (min 5 characters)"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-300">
              Message
            </label>
            <textarea
              className="w-full bg-[#1e1e2f] border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Write your message"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-300">
              Case Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full bg-[#1e1e2f] border border-gray-600 rounded px-3 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-800 transition"
              required
            />
          </div>

          {status && (
            <p
              className={`text-center font-medium ${
                status.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {status}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-all duration-200"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
