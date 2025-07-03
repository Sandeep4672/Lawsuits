import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);
  const lawyerId = localStorage.getItem("lawyerId");

  if (loading) return null; // or a spinner

  if (lawyerId) {
    return <Navigate to="/lawyer-dashboard" replace />;
  }
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;