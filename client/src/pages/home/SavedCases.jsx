import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Trash2 } from "lucide-react"; 
import {removeCase} from "../../utils/handleRemove";
export default function SavedCases() {
  const [savedCases, setSavedCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchSavedCases = async () => {
    try {
      const res = await axios.get("http://localhost:8000/user/saved-cases", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedCases(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch saved cases", err);
    } finally {
      setLoading(false);
    }
  };


  const handleRemove =  (saveId) => {
    removeCase(saveId);
     setSavedCases((prev) => prev.filter((item) => item?.caseId?._id !== saveId));
  };
  useEffect(() => {
    fetchSavedCases();
    document.title = "Your Saved Cases";
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-[#0f172a] text-gray-200 px-6 py-16">
        <h2 className="text-3xl text-center font-bold mb-10">
          Your <span className="text-green-400">Saved Cases</span>
        </h2>

        {loading ? (
          <div className="text-center text-lg text-gray-400 animate-pulse">
            📦 Loading your saved cases...
          </div>
        ) : savedCases.length === 0 ? (
          <div className="text-center text-lg text-red-400">
            You haven't saved any cases yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedCases.map((item) => (
              <div
                key={item._id}
                className="relative bg-[#1e293b] hover:bg-[#2e3b50] rounded-xl shadow-lg transition-all duration-300 p-5 border border-gray-700 hover:border-green-400"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.caseId?._id)}
                  title="Remove from bookmarks"
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <Link to={`/case/${item.caseId._id}`}
                 state={{alreadySaved:true}}
                >
                  <h3 className="text-lg font-semibold text-green-300 truncate">
                    {item.caseId?.title || "Untitled Case"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.caseId?.court || "Unknown Court"} •{" "}
                    {item.caseId?.caseType || "Type N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.caseId?.dateOfJudgment
                      ? new Date(item.caseId.dateOfJudgment).toLocaleDateString()
                      : "No Date"}
                  </p>
                 
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
