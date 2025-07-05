import React from "react";

export default function EducationCard({ education, editMode, onChange }) {
  const handleChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([
      ...education,
      { degree: "", university: "", graduationYear: "" }
    ]);
  };

  const handleRemove = (index) => {
    const updated = [...education];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border transition-all duration-400 border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-4">Education</h2>
      {education.map((entry, index) => (
        <div key={index} className="mb-4 border-b border-gray-700 pb-4">
          {editMode ? (
            <>
              <input
                type="text"
                placeholder="Degree"
                value={entry.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="University"
                value={entry.university}
                onChange={(e) => handleChange(index, "university", e.target.value)}
                className="w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={entry.graduationYear}
                onChange={(e) => handleChange(index, "graduationYear", e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white"
              />
              <button
                onClick={() => handleRemove(index)}
                className="mt-2 text-sm text-red-400 hover:underline"
              >
                Remove
              </button>
            </>
          ) : (
            <div className="text-white text-sm">
              <p><strong>Degree:</strong> {entry.degree}</p>
              <p><strong>University:</strong> {entry.university}</p>
              <p><strong>Graduation Year:</strong> {entry.graduationYear}</p>
            </div>
          )}
        </div>
      ))}

      {editMode && (
        <button
          onClick={handleAdd}
          className="mt-2 text-sm text-blue-300 hover:underline"
        >
          + Add Education
        </button>
      )}
    </div>
  );
}
