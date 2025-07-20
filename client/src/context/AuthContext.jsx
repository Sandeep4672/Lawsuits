import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { decryptWithPassword } from "../utils/cryptoUtils";
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

  try {
    const endpoint = isLawyerLogin
      ? "https://lawsuits.onrender.com/encrypt/lawyer/private-key"
      : "https://lawsuits.onrender.com/encrypt/user/private-key";

    const res = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { encryptedPrivateKey, salt, iv } = res.data.data;

    const decryptedPem = await decryptWithPassword(
      encryptedPrivateKey,
      password,
      salt,
      iv
    );
    console.log(decryptedPem);
    // Optional: store decrypted PEM string
    sessionStorage.setItem("decryptedPrivateKey", decryptedPem);

    // Or: store CryptoKey object in memory if you're using React context
    // const privateKey = await importPrivateKey(decryptedPem);
    // setPrivateKey(privateKey);

    console.log("🔐 RSA Private Key decrypted and stored in sessionStorage");

  } catch (err) {
    console.error("🔐 Failed to decrypt and store private key at login:", err);
  }
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
