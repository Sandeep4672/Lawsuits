import React from "react";

export default function ConsultationFeeCard({ consultationFee, editMode, onChange }) {
  return (
    <div className="bg-white/10 backdrop-blur-md hover:scale-[1.02] p-6 rounded-xl border border-blue-500 shadow-xl transition-all duration-400 hover:shadow-blue-300">
      <h2 className="text-lg font-semibold text-orange-400 mb-2">Consultation Fee</h2>
      {editMode ? (
        <input
          type="number"
          value={consultationFee}
          placeholder="Enter fee in INR"
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-2 py-1 rounded bg-gray-700 text-white"
        />
      ) : (
        <p className="text-white text-sm">₹ {consultationFee || "Not specified"}</p>
      )}
    </div>
  );
}
