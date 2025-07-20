import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
export default function AdminAllCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://lawsuits.onrender.com/admin/get-caseFiles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCases(res.data.data || []);
      } catch (err) {
        setMessage("Failed to fetch case data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.patch(
        `https://lawsuits.onrender.com/admin/delete-case/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCases((cases) => cases.filter((c) => c._id !== id));
    } catch (err) {
      alert("fail to delete case");
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-gray-100 to-white">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
            📂 All Submitted Legal Cases
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading cases...</p>
          ) : message ? (
            <p className="text-center text-red-600 font-semibold">{message}</p>
          ) : cases.length === 0 ? (
            <p className="text-center text-gray-500">No cases available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-blue-100 text-blue-800 font-semibold">
                  <tr>
                    <th className="py-3 px-6">Case Id</th>
                    <th className="py-3 px-6">Case Title</th>
                    <th className="py-3 px-6">Case Type</th>
                    <th className="py-3 px-6">Parties Involved</th>
                    <th className="py-3 px-6">Date Of Judgement</th>
                    <th className="py-3 px-6">Court</th>
                    <th className="py-3 px-6">Case File (PDF)</th>
                    <th className="py-3 px-6">Update Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cases.map((c) => (
                    <tr key={c._id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-3">
                        {c.caseNumber || "Untitled"}
                      </td>

                      <td className="px-6 py-3">{c.title || "Untitled"}</td>
                      <td className="px-6 py-3">{c.caseType || "Untitled"}</td>

                      <td className="px-6 py-3">
                        {` ${c.partiesInvolved[0]} VS ${c.partiesInvolved[1]} ` ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-3">
                        {new Date(c.dateOfJudgment).toLocaleString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-3 ">{c.court}</td>
                      <td className="px-6 py-3">
                        {c.cloudinary ? (
                          <a
                            onClick={() =>
                              navigate("/admin/view-proof", {
                                state: { pdfUrl: c.cloudinary.secure_url },
                              })
                            }
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            View PDF
                          </a>
                        ) : (
                          "No File"
                        )}
                      </td>
                      <td className="py-3 px-6">
                        <button
                          className="bg-red-500 py-2 px-2 border cursor-pointer text-white hover:bg-red-800"
                          onClick={() => {
                            handleDelete(c._id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
