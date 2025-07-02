import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import Navbar from "../Navbar";
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
    if(!query){
      setLoading(false);
      setResults([]);
      setTotalPages(1);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8000/search`, {
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

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen px-6 py-24 bg-gradient-to-br from-green-100 to-green-50">
      <h2 className="text-3xl text-center font-bold mb-8 text-gray-800">
        Results for <span className="text-green-700">"{query}"</span>
      </h2>

      {loading ? (
        <div className="text-center text-lg font-medium text-gray-600">
          Loading search results...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center text-lg text-red-500">
          No results found for <span className="font-semibold">"{query}"</span>.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((item) => (
            <Link to={`/case/${item._id}`} key={item._id}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-200 hover:border-green-500">
                <h3 className="text-lg font-semibold text-green-800 truncate">
                  {item.title || "Untitled Case"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.court || "Unknown Court"} • {item.caseType || "Type N/A"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.dateOfJudgment
                    ? new Date(item.dateOfJudgment).toLocaleDateString()
                    : "No Date"}
                </p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                  {item.summary
                    ? item.summary.slice(0, 50) + "..."
                    : "No summary available."}
                </p>
              </div>
            </Link>
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
                  ? "bg-green-700 text-white shadow-md"
                  : "bg-white border border-gray-300 hover:bg-green-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
