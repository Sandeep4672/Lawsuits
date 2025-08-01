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
import LawyerProtectedRoute from "./pages/Lawyer/LawyerProtectedRoutes";
import MyProfile from "./pages/Lawyer/MyProfile";
import RecentCases from "./pages/home/RecentCases";
import SavedCases from "./pages/home/SavedCases";
import LawyerProfileDetails from "./pages/home/LawyerProfileDetail";
//chat
import UserThreads from "./pages/Chat/UserThread";
import ChatPage from "./pages/Chat/ChatPage";
import LawyerThreads from "./pages/Chat/LawyerThreads";
import AdminAllCases from "./pages/Admin/AllCases";
import LearnMore from "./pages/home/About";
import VerifyOtpAndUpdatePassword from "./pages/auth/VerifyOtpAndUpdatePassword";
import LawyerForgotPassword from "./pages/Lawyer/ForgotPassword";
import LawyerVerifyOtpAndChangePassword from "./pages/Lawyer/ChangePassword";
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<LearnMore/>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtpAndUpdatePassword />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/500" element={<InternalServerError />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/view-pdf/:id" element={<ViewPdf />} />
          <Route path="/case/:id" element={<CaseDetails />} />
          <Route path="/lawyer-forgot-password" element={<LawyerForgotPassword />} />
          <Route path="/lawyer-verify-otp" element={<LawyerVerifyOtpAndChangePassword />} />
          {/* Protected Routes for Users */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/get-document-summary"
            element={
              <ProtectedRoute>
                <DocumentSummarization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-lawyers"
            element={
              <ProtectedRoute>
                <FindLawyer />
              </ProtectedRoute>
            }
          />
          <Route
           path="/history"
           element={
             <ProtectedRoute>
               <RecentCases />
             </ProtectedRoute>
           }/>
           <Route
           path="/saved-cases"
           element={
             <ProtectedRoute>
               <SavedCases />
             </ProtectedRoute>
           }/>
          <Route
            path="/lawyer-profile/:id"
            element={
              <ProtectedRoute>
                <LawyerProfile />
              </ProtectedRoute>
            }
          />
          <Route
          path="/lawyer-profile-data/:id"
          element={<ProtectedRoute>
                <LawyerProfileDetails />
              </ProtectedRoute>}
              />
          {/* Protected Routes for Lawyers */}
          <Route
            path="/lawyer/profile"
            element={
              <LawyerProtectedRoute>
                <MyProfile />
              </LawyerProtectedRoute>
            }
            />
          <Route
            path="/lawyer/request-connection"
            element={
              <ProtectedRoute>
                <ConnectionRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lawyer/connection-requests"
            element={
              <LawyerProtectedRoute>
                <ConnectionRequests />
              </LawyerProtectedRoute>
            }
          />
          <Route
            path="/lawyer/accepted-connections"
            element={
              <LawyerProtectedRoute>
                <AcceptedConnection />
              </LawyerProtectedRoute>
            }
          />
          <Route
            path="/lawyer-dashboard"
            element={
              <LawyerProtectedRoute>
                <LawerDashboard />
              </LawyerProtectedRoute>
            }
          />
          <Route
            path="/lawyer/request-connection"
            element={
              <ProtectedRoute>
                <ConnectionRequestForm />
              </ProtectedRoute>
            }
          />{" "}
          <Route
            path="/lawyer/connection-requests"
            element={
              <LawyerProtectedRoute>
                <ConnectionRequests />
              </LawyerProtectedRoute>
            }
          />
          <Route
            path="/lawyer/accepted-connections"
            element={
              <LawyerProtectedRoute>
                <AcceptedConnection />
              </LawyerProtectedRoute>
            }
          />
          <Route
            path="/lawyer-dashboard"
            element={
              <LawyerProtectedRoute>
                <LawerDashboard />
              </LawyerProtectedRoute>
            }
          />
         
          {/* Protected Routes for Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/lawyers"
            element={
              <AdminProtectedRoute>
                <VerifiedLawyer />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/lawyer-requests"
            element={
              <AdminProtectedRoute>
                <LawyerRequests />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/lawyer/:id"
            element={
              <AdminProtectedRoute>
                <LawyerDetail />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/all-cases"
            element={
              <AdminProtectedRoute>
                <AdminAllCases />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/verified-lawyer/:id"
            element={
              <AdminProtectedRoute>
                <VerifiedLawyerDetails />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/view-proof"
            element={
              <AdminProtectedRoute>
                <ViewProofFile />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/add-case"
            element={
              <AdminProtectedRoute>
                <AddCase />
              </AdminProtectedRoute>
            }
          />
          {/*Lawyer Routes*/}
          <Route path="/lawyer-signup" element={<LawyerSignup />} />
          <Route path="/lawyer-login" element={<LawyerLogin />} />
          {/* Chat Routes */}
          <Route path="/chat/threads" element={<UserThreads />} />
          <Route path="/chat/thread/:id" element={<ChatPage />} />
          <Route path="/chat/lawyer/threads" element={<LawyerThreads />} />
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}