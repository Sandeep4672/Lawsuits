import React from "react";

export default function FirmDetailsCard({ firm, address, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border transition-all duration-400 border-blue-500 shadow-xl hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Current Firm & Address</h2>
      {editMode ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-orange-300 mb-1">Firm Name</label>
            <input
              type="text"
              value={firm}
              onChange={(e) => onChange("currentFirm", e.target.value)}
              className="w-full px-3 py-1 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-orange-300 mb-1">Office Address</label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => onChange("officeAddress", e.target.value)}
              className="w-full px-3 py-1 rounded bg-gray-700 text-white"
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-200">
          {firm || "N/A"} <br />
          {address || "No address provided."}
        </p>
      )}
    </div>
  );
}
