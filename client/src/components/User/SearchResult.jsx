import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {saveCase} from "../../utils/handleSaveCase";
import { Bookmark } from "lucide-react";
export default function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    if (!query) {
      setLoading(false);
      setResults([]);
      setTotalPages(1);
      return;
    }
    try {
      const res = await axios.get(`https://lawsuits.onrender.com/search`, {
        params: { query, page },
      });
      setResults(res.data.data.results);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [location.search, page]);

  useEffect(() => {
    document.title = `Search: ${query}`;
  }, [query]);

  const handleSaveCase = (id)=>{
       saveCase(id);
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 py-24 bg-[#0f172a] text-gray-200">
        <h2 className="text-3xl text-center font-bold mb-8">
          Results for <span className="text-green-400">"{query}"</span>
        </h2>

        {loading ? (
          <div className="text-center text-lg font-medium animate-pulse text-gray-400">
            🔍 Searching for legal documents...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center text-lg text-red-400">
            No results found for{" "}
            <span className="font-semibold text-white">"{query}"</span>.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item) => (
              <div
                key={item._id}
                className="relative bg-[#1e293b] hover:bg-[#2e3b50] rounded-xl shadow-lg transition-all duration-300 p-5 border border-gray-700 hover:border-green-400"
              >
                {/* Save Button */}
                <button
                  onClick={() => handleSaveCase(item._id)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-green-400 transition"
                  title="Save to bookmarks"
                >
                  <Bookmark className="w-5 h-5" />
                </button>

                {/* Clickable Link */}
                <Link to={`/case/${item._id}`}>
                  <h3 className="text-lg font-semibold text-green-300 truncate">
                    {item.title || "Untitled Case"}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {item.court || "Unknown Court"} •{" "}
                    {item.caseType || "Type N/A"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.dateOfJudgment
                      ? new Date(item.dateOfJudgment).toLocaleDateString()
                      : "No Date"}
                  </p>
                  <p className="text-sm text-gray-300 mt-3 line-clamp-3">
                    {item.summary
                      ? item.summary.slice(0, 100) + "..."
                      : "No summary available."}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages >= 1 && (
          <div className="flex justify-center mt-12 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                  page === i + 1
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
