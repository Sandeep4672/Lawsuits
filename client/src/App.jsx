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
import ProfilePage from "./components/User/ProfilePage";
import NotFound from "./pages/error/NotFound";
import InternalServerError from "./pages/error/InternalServerError";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./components/User/SearchResult";
import CaseDetails from "./components/User/CaseDetail";
import ApplyForLawyer from "./pages/Lawyer/ApplyForLawyer";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VerifiedLawyer from "./pages/Admin/VerifiedLawyer";
import LawyerRequests from "./pages/Admin/LawyerRequest";
import LawyerDetail from "./pages/Admin/LawyerDetails";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/get-document-summary" element={<ProtectedRoute><DocumentSummarization/></ProtectedRoute>}/>
          <Route path="/footer" element={<Footer/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/500" element={<InternalServerError/>}/>
          <Route path="/search-results" element={<SearchResults/>}/>
          <Route path="/case/:id" element={<CaseDetails />} />
          <Route path="/apply-for-lawyer" element={<ApplyForLawyer/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/lawyers" element={<VerifiedLawyer/>}/>
          <Route path="/admin/lawyer-requests" element={<LawyerRequests/>}/>
          <Route path="/admin/lawyer/:id" element={<LawyerDetail/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}