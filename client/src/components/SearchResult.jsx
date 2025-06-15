import { useEffect, useState } from "react";
import axios from "axios";

export default function SearchResults({ query, category, year }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8000/search", {
          params: { query, category, year },
        });
        setResults(response.data);
      } catch (err) {
        setError("Failed to fetch results.");
      }
      setLoading(false);
    };

    if (query) fetchResults();
  }, [query, category, year]);

  return (
    <div className="mt-6">
      {loading && <p className="text-blue-600">Loading results...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {results.length === 0 && !loading && (
        <p className="text-gray-500">No results found.</p>
      )}

      <ul className="space-y-4">
        {results.map((result, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold text-green-800">
              {result.caseTitle}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {result.court} • {result.year}
            </p>
            <p className="text-gray-800 text-sm line-clamp-3">
              {result.summary || "No summary available."}
            </p>
            <a
              href={`/case/${result._id}`}
              className="text-blue-600 text-sm mt-2 inline-block hover:underline"
            >
              View full case
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
