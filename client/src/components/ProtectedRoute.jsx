
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or useContext/Auth state

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
