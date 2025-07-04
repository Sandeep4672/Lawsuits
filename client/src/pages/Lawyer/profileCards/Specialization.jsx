import React from "react";

export default function SpecializationsCard({ practiceAreas, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border transition-all duration-400  border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">practiceAreas</h2>
      {editMode ? (
        <input
          type="text"
          value={practiceAreas.join(", ")}
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()))}
          placeholder="Enter practiceAreas separated by commas"
          className="w-full px-2 py-1 rounded bg-gray-700 text-white"
        />
      ) : (
        <div className="flex flex-wrap">
          {practiceAreas.map((area, index) => (
            <span
              key={index}
              className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-sm mr-2 mb-2"
            >
              {area}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}