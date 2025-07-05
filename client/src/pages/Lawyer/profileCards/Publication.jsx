import React from "react";

export default function PublicationsCard({ publications, editMode, onChange }) {
  const handleChange = (index, field, value) => {
    const updated = [...publications];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...publications, { title: "", link: "" }]);
  };

  const handleRemove = (index) => {
    const updated = publications.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md transition-all duration-400 hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Publications</h2>
      {editMode ? (
        <div className="space-y-4">
          {publications.map((pub, index) => (
            <div key={index} className="space-y-1">
              <input
                type="text"
                placeholder="Title"
                value={pub.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full px-2 py-1 rounded bg-gray-700 text-white"
              />
              <input
                type="text"
                placeholder="Link"
                value={pub.link}
                onChange={(e) => handleChange(index, "link", e.target.value)}
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
            className="mt-2 text-sm text-blue-300 hover:underline"
          >
            + Add Publication
          </button>
        </div>
      ) : (
        <ul className="text-sm">
          {publications.map((pub, i) => (
            <li key={i}>
              <a href={pub.link} className="text-blue-300 underline">
                {pub.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
