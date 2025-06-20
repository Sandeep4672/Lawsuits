import { useContext,useEffect } from "react";
import { Link ,useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
export default function Home() {
   const { isLoggedIn, user, logout } = useContext(AuthContext);
   const navigate = useNavigate();
   useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-white flex flex-col items-center justify-center text-center px-6">
      <Navbar></Navbar>
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
          Welcome to LawSuits
        </h1>
        <p className="text-gray-600 text-xl md:text-xl mb-8">
          Search legal cases, get instant AI-based legal summaries, and manage your legal queries in one place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-400 text-white rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-gray-100 border border-gray-300 text-blue-600 rounded-lg text-lg hover:bg-gray-200 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
