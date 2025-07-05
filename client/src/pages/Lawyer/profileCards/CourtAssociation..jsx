import React from "react";

export default function CourtAssociationsCard({ associations, editMode, onChange }) {
  const handleAssociationChange = (index, value) => {
    const updated = [...associations];
    updated[index] = value;
    onChange(updated);
  };

  const addAssociation = () => {
    onChange([...associations, ""]);
  };

  const removeAssociation = (index) => {
    onChange(associations.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Court Associations</h2>
      {editMode ? (
        <div className="space-y-2">
          {associations.map((association, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={association}
                onChange={(e) => handleAssociationChange(i, e.target.value)}
                className="bg-gray-700 text-white px-2 py-1 rounded w-full"
              />
              <button
                onClick={() => removeAssociation(i)}
                className="text-red-400 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addAssociation}
            className="text-sm text-blue-300 hover:underline"
          >
            + Add Court Association
          </button>
        </div>
      ) : (
        <ul className="text-sm list-disc pl-5">
          {associations.map((court, i) => (
            <li key={i}>{court}</li>
          ))}
        </ul>
      )}
    </div>
  );
}