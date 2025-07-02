import React, { useContext, useState, useRef, useEffect } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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

  const handleLogout = async () => {
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1a1a1a] text-white shadow-lg py-3 px-4 sm:px-6 flex justify-between items-center">
      {/* Logo */}
      <Link to="/">
        <div className="text-2xl cursor-pointer font-bold text-green-400 flex items-center gap-2">
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
          className="w-full max-w-md px-4 py-2 bg-[#333] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Search
        </button>
      </form>

      {/* Hamburger for Mobile */}
      <div
        className="md:hidden text-2xl text-green-400 cursor-pointer"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-6 relative">
        {isLoggedIn && user ? (
          <>
            <button className="hover:text-green-400 transition">Saved</button>
            <button className="hover:text-green-400 transition">History</button>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-3xl text-green-400" />
              <span
                onClick={() => navigate("/profile")}
                className="cursor-pointer hover:underline"
              >
                {user?.fullName}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={toggleLoginDropdown}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Login ▼
            </button>
            {loginDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] border border-gray-700 rounded shadow-lg z-50">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-white hover:bg-green-700 transition"
                  onClick={() => setLoginDropdown(false)}
                >
                  User Login
                </Link>
                <Link
                  to="/lawyer-login"
                  className="block px-4 py-2 text-white hover:bg-green-700 transition"
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
        <div className="absolute top-16 left-0 w-full bg-[#1a1a1a] border-t border-gray-800 shadow-md md:hidden p-4 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search legal topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-[#333] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Search
            </button>
          </form>

          {isLoggedIn && user ? (
            <>
              <button className="w-full text-left hover:text-green-400 transition">
                Saved Items
              </button>
              <button className="w-full text-left hover:text-green-400 transition">
                History
              </button>
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-green-400" />
                <span
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {user?.fullName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-center"
              >
                User Login
              </Link>
              <Link
                to="/lawyer-login"
                className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-center"
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
