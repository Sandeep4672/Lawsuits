import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const lawyerId = localStorage.getItem("lawyerId");

    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
      setIsLawyer(!!lawyerId);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsLawyer(false);
    }
    setLoading(false);
  }, []);

  const login = async (token, userObj, password, isLawyerLogin = false) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    if (isLawyerLogin) localStorage.setItem("lawyerId", userObj._id);

    setIsLoggedIn(true);
    setUser(userObj);
    setIsLawyer(isLawyerLogin);
  };

  const logout = () => {
    return new Promise((resolve) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lawyerId");
      setIsLoggedIn(false);
      setUser(null);
      setIsLawyer(false);
      resolve();
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        loading,
        isLawyer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
