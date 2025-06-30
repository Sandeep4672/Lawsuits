import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Dashboard from "./pages/home/Dashboard";
import { AuthProvider } from "./context/AuthContext"; 
import DocumentSummarization from "./pages/AI/DocumentSummary";
import Footer from "./components/Footer";
import ProfilePage from "./components/User/ProfilePage";
import NotFound from "./pages/error/NotFound";
import InternalServerError from "./pages/error/InternalServerError";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchResults from "./components/User/SearchResult";
import CaseDetails from "./components/User/CaseDetail";
import ViewPdf from "./components/User/ViewPdf";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import VerifiedLawyer from "./pages/Admin/VerifiedLawyer";
import LawyerRequests from "./pages/Admin/LawyerRequest";
import LawyerDetail from "./pages/Admin/LawyerDetails";
import VerifiedLawyerDetails from "./pages/Admin/VerifiedLawerProfile";
import ViewProofFile from "./pages/Admin/ViewProofFile";
import AddCase from "./pages/Admin/AddCase";
import LawyerSignup from "./pages/Lawyer/LawerSignup";
import LawyerLogin from "./pages/Lawyer/LawerLogin";
import LawerDashboard from "./pages/Lawyer/LawerDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import FindLawyer from "./pages/home/FindLawyer";
import LawyerProfile from "./pages/home/LawyerProfile";
import ConnectionRequestForm from "./pages/Chat/ConnectionRequestForm";
import ConnectionRequests from "./pages/Lawyer/ConnectionRequests";
import AcceptedConnection from "./pages/Lawyer/AcceptedConnection";
//chat
import UserThreads from "./pages/Chat/UserThread";
import ChatPage from "./pages/Chat/ChatPage";
import LawyerThreads from "./pages/Chat/LawyerThreads";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}/>
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/get-document-summary" element={<ProtectedRoute><DocumentSummarization/></ProtectedRoute>}/>
          <Route path="/find-lawyers" element={<ProtectedRoute><FindLawyer/></ProtectedRoute>}/>
          <Route path="/lawyer-profile/:id" element={<ProtectedRoute><LawyerProfile/></ProtectedRoute>}/>
          <Route path="/lawyer/request-connection" element={<ConnectionRequestForm/>}/>
          <Route path="/lawyer/connection-requests" element={<ConnectionRequests/>}/>
          <Route path="/lawyer/accepted-connections" element={<AcceptedConnection/>}/>
          <Route path="/footer" element={<Footer/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/500" element={<InternalServerError/>}/>
          <Route path="/search-results" element={<SearchResults/>}/>
          <Route path="/view-pdf/:id" element={<ViewPdf/>}/>
          <Route path="/case/:id" element={<CaseDetails />} />
          {/* Protected Routes for Admin */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
          <Route path="/admin/lawyers" element={<AdminProtectedRoute><VerifiedLawyer/></AdminProtectedRoute>}/>
          <Route path="/admin/lawyer-requests" element={<AdminProtectedRoute><LawyerRequests/></AdminProtectedRoute>}/>
          <Route path="/admin/lawyer/:id" element={<AdminProtectedRoute><LawyerDetail/></AdminProtectedRoute>}/>
          <Route path="/admin/verified-lawyer/:id" element={<AdminProtectedRoute><VerifiedLawyerDetails/></AdminProtectedRoute>}/>
          <Route path="/admin/view-proof" element={<AdminProtectedRoute><ViewProofFile/></AdminProtectedRoute>}/>
          <Route path="/admin/add-case" element={<AdminProtectedRoute><AddCase/></AdminProtectedRoute>}/>
          {/*Lawyer Routes*/}
          <Route path="/lawyer-signup" element={<LawyerSignup/>}/>
          <Route path="/lawyer-login" element={<LawyerLogin/>}/>
          <Route path="/lawyer-dashboard" element={<LawerDashboard/>}/>
          { /* Chat Routes */}
          <Route path="/chat/threads" element={<UserThreads/>}/>
          <Route path="/chat/thread/:id" element={<ChatPage/>}/>
          <Route path="/chat/lawyer/threads" element={<LawyerThreads/>}/>
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}