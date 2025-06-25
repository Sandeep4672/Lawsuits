import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user ,loading} = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && (user.isAdmin === true )) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtectedRoute;