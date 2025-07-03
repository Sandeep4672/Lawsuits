import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
export default function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCase = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/search/case/${id}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCaseData(res.data.data);
      } catch (err) {
        console.error("Error fetching case:", err);
      }
    };
    fetchCase();
  }, [id]);

  if (!caseData)
    return (
      <p className="text-center text-gray-400 mt-20 text-lg animate-pulse">
        Loading case details...
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-40 pb-20 px-6 sm:px-10 bg-[#0f172a] text-gray-200">
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          {caseData.title || "Untitled Case"}
        </h1>

        <div className="space-y-3 text-base text-gray-300 max-w-3xl mx-auto">
          {caseData.caseNumber && (
            <p>
              <span className="font-semibold text-cyan-400">Case Number:</span>{" "}
              {caseData.caseNumber}
            </p>
          )}
          {caseData.partiesInvolved?.length > 0 && (
            <p>
              <span className="font-semibold text-cyan-400">Parties:</span>{" "}
              {caseData.partiesInvolved.join(" vs ")}
            </p>
          )}
          {caseData.court && (
            <p>
              <span className="font-semibold text-cyan-400">Court:</span>{" "}
              {caseData.court}
            </p>
          )}
          {caseData.caseType && (
            <p>
              <span className="font-semibold text-cyan-400">Case Type:</span>{" "}
              {caseData.caseType}
            </p>
          )}
          {caseData.dateOfJudgment && (
            <p>
              <span className="font-semibold text-cyan-400">Judgment Date:</span>{" "}
              {new Date(caseData.dateOfJudgment).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Tags */}
        {caseData.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {caseData.tags.map((tag, idx) => (
              <a
                key={idx}
                href={`https://indiankanoon.org/search/?formInput=${encodeURIComponent(tag)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-800 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-cyan-600 transition"
                title={`Search "${tag}" on Google`}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* View PDF Button */}
        {caseData.pdfUrl && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() =>
                navigate(`/view-pdf/${id}`, {
                  state: { pdfUrl: caseData.pdfUrl },
                })
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition shadow"
            >
              View PDF Document
            </button>
          </div>
        )}

        {/* Summary or Description */}
        {caseData.summary || caseData.description ? (
          <div className="mt-10 bg-[#1e293b] p-6 rounded-xl shadow-lg text-gray-200 leading-relaxed whitespace-pre-wrap max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-400">
              Case Summary
            </h2>
            <p>{caseData.description || caseData.summary}</p>
          </div>
        ) : (
          <p className="mt-6 text-gray-500 text-center italic">
            No summary or description available.
          </p>
        )}
      </div>
      <Footer/>
    </>
  );
}
