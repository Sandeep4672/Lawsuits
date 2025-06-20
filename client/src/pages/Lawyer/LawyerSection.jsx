import React from "react";

export default function LawyerSection({ lawyerStatus, navigate }) {
  if (lawyerStatus === "yes") {
    return (
      <button
        onClick={() => navigate("/lawyer-dashboard")}
        className="mt-4 px-4 py-2 cursor-pointer bg-green-600 text-white rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Lawyer Dashboard
      </button>
    );
  } else if (lawyerStatus === "pending") {
    return (
      <p className="mt-4 text-yellow-600 font-semibold">
        🕒 Your lawyer application is under review.
      </p>
    );
  } else if(lawyerStatus==="no") {
    return (
      
      <button
        onClick={() => navigate("/apply-for-lawyer")}
        className="mt-4 px-4 py-2 cursor-pointer bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Apply For Lawyer 
      </button>
    );
  }
}