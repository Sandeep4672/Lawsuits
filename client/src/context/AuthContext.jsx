import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check for JWT token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Check for fullName or name, fallback to "User"
        const userName = payload.fullName || payload.name || "User";
        setUser({ ...payload, fullName: userName });
      } catch {
        setUser({ fullName: "User" });
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  // Login function (call this after successful login)
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userName = payload.fullName || payload.name || "User";
      setUser({ ...payload, fullName: userName });
    } catch {
      setUser({ fullName: "notuser" });
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}