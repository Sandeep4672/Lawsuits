import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userStr));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    setLoading(false);
  }, []);

  const logout = () => {
    return new Promise((resolve) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (localStorage.getItem("lawyerId")) {
        localStorage.removeItem("lawyerId");
      }

      setIsLoggedIn(false);
      setUser(null);
      resolve();
    });
  };

  // Call this after successful login
  const login = (token, userObj) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setIsLoggedIn(true);
    setUser(userObj);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
