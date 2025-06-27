import React, { useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";

export default function DocumentSummarization() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [terms, setTerms] = useState([]); // NEW
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary("");
    setTerms([]);
    setSaved(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("pdf", file);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/user/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(res.data.summary);
      setTerms(res.data.legalTerms || []); // ✅ capture terms
    } catch (err) {
      setSummary("Error processing PDF. Please try again.");
      setTerms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:8000/fn/save-summary", {
        filename: file?.name || "Untitled Document",
        summary,
        terms, // optional: if you also save legal terms
      });
      if (response.status === 200) {
        setSaved(true);
      }
    } catch (err) {
      console.error("Error saving summary:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-12 bg-gradient-to-br from-green-200 to-green-100 px-4 py-20">
        <motion.div
          className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-green-800 tracking-wide">
            📄 AI-Powered Document Summarizer
          </h2>

          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-full border-2 border-dashed border-green-400 rounded-xl py-4 px-6 text-center text-gray-500 hover:bg-green-50 transition-all">
                {file ? file.name : "Click to upload a PDF file"}
              </div>
              <h4 className="text-lg font-bold mb-6 text-center text-gray-400 tracking-wide">
                LawSuits only provide information, not legal advice.
              </h4>
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2 rounded-lg shadow transition"
            >
              <FaFileUpload /> {loading ? "Processing..." : "Upload and Summarize"}
            </motion.button>
          </motion.div>

          {loading && (
            <motion.p
              className="mt-6 text-center text-gray-500 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Summarizing your document... please wait.
            </motion.p>
          )}

          {summary && (
            <motion.div
              className="mt-8 bg-gray-50 border border-green-200 p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                📝 Summary
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                {summary}
              </p>

              {terms.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">
                    📚 Legal Terms Identified
                  </h4>
                  <ul className="list-disc pl-6 text-gray-600 space-y-1">
                    {terms.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow"
              >
                {saved ? "✅ Saved" : "💾 Save Summary"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
