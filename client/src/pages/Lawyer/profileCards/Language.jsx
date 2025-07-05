import React from "react";

export default function LanguagesCard({ languages, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Languages</h2>
      {editMode ? (
        <input
          type="text"
          value={languages.join(", ")}
          onChange={(e) => onChange(e.target.value.split(",").map((l) => l.trim()))}
          placeholder="Enter languages separated by commas"
          className="w-full px-2 py-1 rounded bg-gray-700 text-white"
        />
      ) : (
        <p>{languages.join(", ")}</p>
      )}
    </div>
  );
}