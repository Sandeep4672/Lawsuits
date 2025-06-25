import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ; 
  if (token && (user?.isAdmin === true || user?.isAdmin === "yes" || user?.isAdmin === "true"))  {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtectedRoute;