import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Dashboard from "./pages/home/Dashboard";
import { AuthProvider } from "./context/AuthContext"; // Adjust path if needed
import DocumentSummarization from "./pages/AI/DocumentSummary";
import Footer from "./components/Footer";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/get-document-summary" element={<DocumentSummarization/>}/>
          <Route path="/footer" element={<Footer/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}