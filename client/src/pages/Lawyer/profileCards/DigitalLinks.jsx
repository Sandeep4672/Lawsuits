import React from "react";

export default function DigitalLinksCard({ digitalPresence, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Digital Links</h2>
      {editMode ? (
        <div className="space-y-2">
          <input
            type="text"
            value={digitalPresence.linkedin || ""}
            placeholder="LinkedIn URL"
            onChange={(e) => onChange("linkedin", e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            value={digitalPresence.website || ""}
            placeholder="Website URL"
            onChange={(e) => onChange("website", e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            value={digitalPresence.barAssociationProfile || ""}
            placeholder="Bar Association Profile URL"
            onChange={(e) => onChange("barAssociationProfile", e.target.value)}
            className="w-full px-2 py-1 rounded bg-gray-700 text-white"
          />
        </div>
      ) : (
        <ul className="text-sm">
          {digitalPresence.linkedin && <li>LinkedIn: {digitalPresence.linkedin}</li>}
          {digitalPresence.website && <li>Website: {digitalPresence.website}</li>}
          {digitalPresence.barAssociationProfile && <li>Bar Profile: {digitalPresence.barAssociationProfile}</li>}
        </ul>
      )}
    </div>
  );
}