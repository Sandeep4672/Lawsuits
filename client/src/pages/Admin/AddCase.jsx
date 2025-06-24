import React, { useState } from "react";
import axios from "axios";

export default function AddCase() {
  const [form, setForm] = useState({
    title: "",
    caseNumber: "",
    caseType: "",
    court: "",
    dateOfJudgment: "",
    partiesInvolved: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setMessage("CASE file is required.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("pdf", pdfFile);

      await axios.post(
        "http://localhost:8000/admin/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Case added successfully!");
      setForm({
        title: "",
        caseNumber: "",
        caseType: "",
        court: "",
        dateOfJudgment: "",
        partiesInvolved: "",
      });
      setPdfFile(null);
    } catch (err) {
      setMessage("Failed to add case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 bg-gradient-to-br from-pink-100 to-pink-50 px-4 py-12">
      <div className="max-w-xl mx-auto bg-white border border-pink-200 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-pink-700 mb-8 text-center">
          📄 Add New Case
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Case Title</label>
            <input
              type="text"
              name="title"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Case Number</label>
            <input
              type="text"
              name="caseNumber"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.caseNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Case Type</label>
            <input
              type="text"
              name="caseType"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.caseType}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Court</label>
            <input
              type="text"
              name="court"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.court}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date of Judgment</label>
            <input
              type="date"
              name="dateOfJudgment"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.dateOfJudgment}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Parties Involved (comma separated)</label>
            <input
              type="text"
              name="partiesInvolved"
              className="w-full border border-pink-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={form.partiesInvolved}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold transition"
          >
            {loading ? "Uploading..." : "Add Case"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-pink-600 font-medium">{message}</p>
        )}
      </div>
       </div>
  );
}