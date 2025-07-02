import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl">
          <h1 className="pt-24 text-5xl font-extrabold text-green-700 mb-4 animate-fade-in-down">
<img src="/LawSuitsLogo1.png" alt="LawSuits Logo" className="inline-block align-middle w-12 h-12 mr-2" /> Welcome to <span className="text-blue-700">LawSuits</span>          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-10">
            Empowering you with easy access to legal insights, verified lawyers,
            and instant AI summaries for your legal queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            {/* User Box */}
            <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-gray-300 shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-green-700 mb-5">👥 For Users</h2>
              <p className="text-gray-600 mb-4">Access your dashboard, track legal queries, and connect with lawyers easily.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-white border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Lawyer Box */}
            <div className="rounded-2xl bg-white/60 backdrop-blur-md border border-gray-300 shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-blue-700 mb-5">⚖️ For Lawyers</h2>
              <p className="text-gray-600 mb-4">Manage client requests, update availability, and offer legal guidance.</p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/lawyer-login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Lawyer Login
                </Link>
                <Link
                  to="/lawyer-signup"
                  className="px-6 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Lawyer Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
