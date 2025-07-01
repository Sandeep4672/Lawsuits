import { Navigate } from "react-router-dom";

export default function LawyerProtectedRoute({ children }) {
  // You can check for a lawyer token, role, or lawyerId in localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isLawyer = user?.role === "lawyer" || localStorage.getItem("lawyerId");
  if (!isLawyer) {
    // Redirect to lawyer login if not authenticated as lawyer
    return <Navigate to="/error" replace />;
  }

  return children;
}