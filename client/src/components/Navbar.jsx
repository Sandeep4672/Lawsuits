import React, { useContext, useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${search}`);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md py-3 px-4 sm:px-6 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-green-700">LawSuits</div>

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
          className="w-full max-w-md px-4 py-2 border  text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-cyan-800 transition"
        >
          Search
        </button>
      </form>

      {/* Hamburger Menu */}
      <div
        className="md:hidden text-2xl text-green-700 cursor-pointer"
        onClick={toggleMenu}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <button className="text-gray-700 hover:text-cyan-700 font-medium">
              Saved Items
            </button>
            <button className="text-gray-700 hover:text-cyan-700 font-medium">
              History
            </button>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-3xl text-cyan-700" />
              <span
                onClick={() => navigate("/profile")}
                className="text-gray-700 font-medium hover:underline cursor-pointer"
              >
                {user.fullName}
              </span>

              <button
                className="ml-2 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-500 text-sm"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <button
            className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800 transition"
            onClick={handleLogin}
          >
            Login
          </button>
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
              className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-cyan-800 transition"
            >
              Search
            </button>
          </form>

          {isLoggedIn ? (
            <>
              <button className="w-full text-left text-gray-700 hover:text-cyan-700 font-medium">
                Saved Items
              </button>
              <button className="w-full text-left text-gray-700 hover:text-cyan-700 font-medium">
                History
              </button>
              <div className="flex items-center gap-2">
                <FaUserCircle className="text-2xl text-red-700" />
                <span
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="text-gray-600 font-medium hover:underline cursor-pointer"
                >
                  {user.fullName}
                </span>
              </div>
              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-800 transition"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
