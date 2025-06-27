import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";

export default function ConnectionRequestForm() {
  const { state } = useLocation();
  const lawyer = state?.lawyer;
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  if (!lawyer) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-600 text-lg">No lawyer selected.</div>
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
      formData.append("lawyer", lawyer._id);
      formData.append("message", message);
      if (file) formData.append("documents", file);

      await axios.post("http://localhost:8000/user/connection-request", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus(" Request sent successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setStatus(" Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-green-200 to-green-100 flex items-center justify-center">
        <form
          className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full space-y-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Request to Chat with {lawyer.fullName}
          </h2>
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Case Document</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          {status && <p className="text-center font-medium">{status}</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              {loading ? "Sending..." : "Send Request"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}