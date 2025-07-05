export default function EducationCard({ education, editMode, onChange }) {
 const handleChange = (e, index, field) => {
  const updated = [...education];
  updated[index][field] = e.target.value;
  onChange(updated); // This will call the parent’s updater
};


  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Education</h2>
      {editMode ? (
        education.map((edu, index) => (
          <div key={index} className="mb-4 space-y-2">
            <input
              type="text"
              value={edu.degree}
              placeholder="Degree"
              onChange={(e) => handleChange(e, index, "degree")}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              value={edu.university}
              placeholder="University"
              onChange={(e) => handleChange(e, index, "university")}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            />
            <input
              type="number"
              value={edu.graduationYear}
              placeholder="Year"
              onChange={(e) => handleChange(e, index, "graduationYear")}
              className="w-full px-2 py-1 rounded bg-gray-700 text-white"
            />
          </div>
        ))
      ) : (
        <ul className="list-disc pl-5">
          {education.map((edu, i) => (
            <li key={i}>
              {edu.degree}, {edu.university} ({edu.graduationYear})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
