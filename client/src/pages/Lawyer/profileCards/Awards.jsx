import React from "react";

export default function AwardsCard({ awards, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Awards</h2>
      {editMode ? (
        awards.map((award, index) => (
          <div key={index} className="mb-4 space-y-2">
            <input
              type="text"
              value={award.title}
              placeholder="Award Title"
              onChange={(e) => onChange(e, index, "title")}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              value={award.year}
              placeholder="Year"
              onChange={(e) => onChange(e, index, "year")}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            />
          </div>
        ))
      ) : (
        <ul className="text-sm">
          {awards.map((award, i) => (
            <li key={i}>{award.title} ({award.year})</li>
          ))}
        </ul>
      )}
    </div>
  );
}
