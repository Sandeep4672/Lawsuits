import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { importPrivateKey, decryptWithPassword } from "../utils/cryptoUtils";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decryptedPrivateKey, setDecryptedPrivateKey] = useState(null);
  const [isLawyer, setIsLawyer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const lawyerId = localStorage.getItem("lawyerId");

    if (token && userStr) {
      const parsedUser = JSON.parse(userStr);
      setIsLoggedIn(true);
      setUser(parsedUser);
      setIsLawyer(!!lawyerId);
      setLoading(false);
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsLawyer(false);
      setLoading(false);
    }
  }, []);

  const login = async (token, userObj, password, isLawyerLogin = false) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userObj));
  if (isLawyerLogin) localStorage.setItem("lawyerId", userObj._id);

  setIsLoggedIn(true);
  setUser(userObj);
  setIsLawyer(isLawyerLogin);

  try {
    const endpoint = isLawyerLogin
      ? "http://localhost:8000/encrypt/lawyer/private-key"
      : "http://localhost:8000/encrypt/user/private-key";

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { rsaPrivateKey } = res.data.data;

    // Convert PEM string to CryptoKey object
    const privateKeyObj = await importPrivateKey(rsaPrivateKey);

    // Optionally store in memory or localStorage
    setDecryptedPrivateKey(privateKeyObj);
    localStorage.setItem("rsaPrivateKey", rsaPrivateKey); // optional
  } catch (err) {
    console.error("❌ Failed to retrieve RSA private key:", err.message);
  }
};


  const logout = () => {
    return new Promise((resolve) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("lawyerId");
      localStorage.removeItem("rsaPrivateKey");
      setIsLoggedIn(false);
      setUser(null);
      setIsLawyer(false);
      setDecryptedPrivateKey(null);
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
        decryptedPrivateKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
