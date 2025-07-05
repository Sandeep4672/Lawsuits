import React from "react";

export default function ExperienceCard({ experienceYears, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border transition-all duration-400 border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">experienceYears</h2>
      {editMode ? (
        <input
          type="number"
          name="experience"
          value={experienceYears}
          onChange={onChange}
          className="w-full px-2 py-1 rounded bg-gray-700 text-white"
        />
      ) : (
        <p>{experienceYears} years</p>
      )}
    </div>
  );
}
