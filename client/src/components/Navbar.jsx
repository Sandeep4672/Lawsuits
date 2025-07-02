import React, { useContext, useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search-results?query=${encodeURIComponent(search)}`);
  };

 const handleLogout =async () => {
 await logout();
  navigate("/login");
};


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleLoginDropdown = () => setLoginDropdown((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLoginDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3 px-4 sm:px-6 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <div className="text-2xl cursor-pointer font-bold text-green-700">
          <img
            src="/LawSuitsLogo1.png"
            alt="LawSuits Logo"
            style={{ height: "2em", width: "auto", display: "inline-block" }}
          />
          LawSuits
        </div>
      </Link>

      {/* Desktop Search */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex flex-1 justify-center mx-4"
      >
        <input
          type="text"
          placeholder="Search legal topics, cases, or laws..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full   max-w-md px-4 py-2 border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
        <button
          type="submit"
          className="ml-2 cursor-pointer px-4 py-2 bg-green-700 text-white rounded hover:bg-cyan-800 transition"
        >
          Search
        </button>
      </form>

      {/* Hamburger for Mobile */}
      <div
        className="md:hidden  text-2xl text-green-700 cursor-pointer"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-6 relative">
        {isLoggedIn && user ? (
          <>
            <button className="text-gray-700 hover:text-cyan-700 font-medium">
              Saved
            </button>
            <button className="text-gray-700 hover:text-cyan-700 font-medium">
              History
            </button>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-3xl text-cyan-700" />
              <span
                onClick={() => navigate("/profile")}
                className=" cursor-pointer text-gray-700 font-medium hover:underline"
              >
                {user?.fullName}
              </span>
              <button
                className=" hover:scale-[1.03] cursor-pointer ml-2 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-500 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={toggleLoginDropdown}
              className=" cursor-pointer px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
            >
              Login ▼
            </button>
            {loginDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <Link
                  to="/login"
                  className="hover:scale-[1.05] cursor-pointer block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setLoginDropdown(false)}
                >
                  User Login
                </Link>
                <Link
                  to="/lawyer-login"
                  className="hover:scale-[1.05] cursor-pointer block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setLoginDropdown(false)}
                >
                  Lawyer Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 shadow-md md:hidden p-4 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search legal topics, cases, or laws..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className=" cursor-pointer w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className=" cursor-pointer w-full bg-green-600 text-white py-2 rounded hover:bg-cyan-800 transition"
            >
              Search
            </button>
          </form>

          {isLoggedIn && user ? (
            <>
              <button className=" cursor-pointer w-full text-left text-gray-700 hover:text-cyan-700 font-medium">
                Saved Items
              </button>
              <button className=" cursor-pointer w-full text-left text-gray-700 hover:text-cyan-700 font-medium">
                History
              </button>
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-cyan-700" />
                <span
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="cursor-pointer text-gray-600 font-medium hover:underline"
                >
                  {user?.fullName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="cursor-pointer w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className=" cursor-pointer bg-green-400 text-shadow-gray-400 py-2 rounded hover:bg-cyan-700 transition"
              >
                User Login
              </Link>
              <Link
                to="/lawyer-login"
                className=" cursor-pointer bg-green-400 text-shadow-gray-400 py-2 rounded hover:bg-cyan-700 transition"
              >
                Lawyer Login
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
