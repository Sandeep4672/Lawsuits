import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
export default function CaseDetails() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/search/case/${id}`);
        setCaseData(res.data.data);
      } catch (err) {
        console.error("Error fetching case:", err);
      }
    };
    fetchCase();
  }, [id]);

  if (!caseData)
    return (
      <p className="text-center  text-gray-600 mt-20 text-lg">
        Loading case details...
      </p>
    );
  console.log(caseData);
  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen pt-40 mx-auto py-20 px-6 sm:px-10  bg-gradient-to-br from-green-100 to-green-50">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-4">
          {caseData.title || "Untitled Case"}
        </h1>

        <div className="space-y-3 text-base text-gray-700">
          {caseData.caseNumber && (
            <p>
              <span className="font-semibold text-cyan-800">Case Number:</span>{" "}
              {caseData.caseNumber}
            </p>
          )}

          {caseData.partiesInvolved?.length > 0 && (
            <p>
              <span className="font-semibold text-cyan-800">
                Parties Involved:
              </span>{" "}
              {caseData.partiesInvolved.join(" vs ")}
            </p>
          )}

          {caseData.court && (
            <p>
              <span className="font-semibold text-cyan-800">Court:</span>{" "}
              {caseData.court}
            </p>
          )}

          {caseData.caseType && (
            <p>
              <span className="font-semibold text-cyan-800">Case Type:</span>{" "}
              {caseData.caseType}
            </p>
          )}

          {caseData.dateOfJudgment && (
            <p>
              <span className="font-semibold text-cyan-800">
                Date of Judgment:
              </span>{" "}
              {new Date(caseData.dateOfJudgment).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Tags */}
        {caseData.tags?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {caseData.tags.map((tag, idx) => (
              <a
                key={idx}
                //href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(tag)}`}
                 href={`https://www.google.com/search?q=${encodeURIComponent(tag)}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-cyan-200 transition cursor-pointer"
                title={`Search "${tag}" on Google/Wikipedia`}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}
        {/* Show PDF Button */}
        {caseData.pdfUrl && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() =>
                navigate(`/view-pdf/${id}`, {
                  state: { pdfUrl: caseData.pdfUrl },
                })
              }
              className="cursor-pointer bg-cyan-700 hover:bg-cyan-900 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
            >
              View PDF
            </button>
          </div>
        )}

        {/* Summary */}
        {caseData.summary ? (
          <div className="mt-10 bg-white p-6 rounded-xl shadow text-gray-700 leading-relaxed whitespace-pre-wrap">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              Case Summary
            </h2>
            <p>{caseData.description || caseData.summary}</p>
          </div>
        ) : (
          <p className="mt-6 text-gray-500 italic">
            No summary or description provided.
          </p>
        )}
      </div>
    </>
  );
}
