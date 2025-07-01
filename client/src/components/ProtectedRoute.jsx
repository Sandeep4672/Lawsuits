
import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or useContext/Auth state
  const user= JSON.parse(localStorage.getItem("user"));
  const {logout}=useContext(AuthContext);
  // Check if the user is logged in and has the role of 'lawyer'
  const lawyerId=localStorage.getItem("lawyerId");
  if (!token || !user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
