import React, { useState } from "react";
import axios from "axios";

export default function CaseSearch() {
  const [searchText, setSearchText] = useState("");
  const [court, setCourt] = useState("");
  const [caseType, setCaseType] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = {
        query: searchText,
        court,
        caseType,
        tags,
        startDate,
        endDate,
        sortBy,
        order,
        page: 1,
        limit: 10,
      };
      const res = await axios.get("https://lawsuits.onrender.com/search", { params });
      setResults(res.data.data.results);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 pt-20 ">
      <form
        onSubmit={handleSearch}
        className="bg-green-200 p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-700">Search Cases</h2>

        <input
          type="text"
          placeholder="Enter keywords..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Court"
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Case Type"
            value={caseType}
            onChange={(e) => setCaseType(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="createdAt">Newest</option>
            <option value="title">Title</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-600 mt-4">{error}</p>}

      <div className="mt-8 grid gap-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow rounded-xl border border-gray-200"
          >
            <h3 className="text-xl font-bold text-green-800">
              {result.title || "Untitled Case"}
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              Court: {result.court || "N/A"} | Date: {new Date(result.dateOfJudgment).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mt-2">
              {result.summary?.slice(0, 200) || "No summary available."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
