import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/Footer"
export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-blue-200 px-6 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6 animate-fade-in-down">
            Welcome to LawSuits
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-10">
            Search legal cases, get instant AI-based legal summaries,Chat with Verified lawyers and manage your legal queries in one place.
          </p>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* User Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow bg-white hover:shadow-md transition duration-300">
              <h2 className="text-xl font-semibold text-green-600 mb-4">For Users</h2>
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-gray-100 border border-gray-300 text-green-600 rounded hover:bg-gray-200 transition"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Lawyer Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow bg-white hover:shadow-md transition duration-300">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">For Lawyers</h2>
              <div className="flex flex-col gap-3">
                <Link
                  to="/lawyer-login"
                  className="px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Lawyer Login
                </Link>
                <Link
                  to="/lawyer-signup"
                  className="px-5 py-2 bg-gray-100 border border-gray-300 text-blue-700 rounded hover:bg-gray-200 transition"
                >
                  Lawyer Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
