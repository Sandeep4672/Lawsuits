import React from "react";

export default function SpecializationsCard({ specialization, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Specializations</h2>
      {editMode ? (
        <input
          type="text"
          value={specialization.join(", ")}
          onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()))}
          placeholder="Enter specializations separated by commas"
          className="w-full px-2 py-1 rounded bg-gray-700 text-white"
        />
      ) : (
        <div className="flex flex-wrap">
          {specialization.map((area, index) => (
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