import React from "react";

export default function LawSuitsLogo({ size = 48 }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Scales of Justice */}
        <circle cx="24" cy="24" r="23" stroke="#06b6d4" strokeWidth="2" fill="#e0f2fe" />
        <rect x="22" y="10" width="4" height="20" rx="2" fill="#22c55e" />
        <path d="M24 10 L16 28" stroke="#0e7490" strokeWidth="2" />
        <path d="M24 10 L32 28" stroke="#0e7490" strokeWidth="2" />
        <ellipse cx="16" cy="32" rx="4" ry="2" fill="#06b6d4" />
        <ellipse cx="32" cy="32" rx="4" ry="2" fill="#06b6d4" />
        <circle cx="24" cy="8" r="2" fill="#0e7490" />
      </svg>
      <span className="text-2xl font-bold text-cyan-700">LawSuits</span>
    </div>
  );
}