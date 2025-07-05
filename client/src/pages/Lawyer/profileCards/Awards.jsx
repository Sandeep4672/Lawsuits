import React from "react";

export default function AwardsCard({ awards, editMode, onChange }) {
  const handleChange = (index, field, value) => {
    const updated = [...awards];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...awards, { title: "", year: "" }]);
  };

  const handleRemove = (index) => {
    const updated = [...awards];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl transition-all duration-400 hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-4">Awards</h2>

      {editMode ? (
        <>
          {awards.map((award, index) => (
            <div key={index} className="mb-4 space-y-2 border-b border-gray-700 pb-2">
              <input
                type="text"
                value={award.title}
                placeholder="Award Title"
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white"
              />
              <input
                type="number"
                value={award.year}
                placeholder="Year"
                onChange={(e) => handleChange(index, "year", e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white"
              />
              <button
                onClick={() => handleRemove(index)}
                className="text-sm text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={handleAdd}
            className="text-sm text-blue-300 hover:underline"
          >
            + Add Award
          </button>
        </>
      ) : (
        <ul className="text-sm text-white">
          {awards.map((award, i) => (
            <li key={i}>
              {award.title} ({award.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
