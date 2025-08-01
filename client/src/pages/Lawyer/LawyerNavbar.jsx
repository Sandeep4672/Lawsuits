// components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { LogOut, MessageCircle, CalendarDays, Home, Menu, X,User } from "lucide-react";
import Logo from "../../components/Logo";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("lawyerId");
    logout();
    navigate("/lawyer-login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-400 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/lawyer-dashboard" className="text-xl font-bold text-white flex items-center gap-2">
          <Logo size={35} />
         
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/lawyer/profile" className="text-white hover:text-gray-200 flex item-center gap-1">
           <User size={18}/> My Profile
          </Link>

          <Link to="/lawyer-dashboard" className="text-white hover:text-gray-200 flex items-center gap-1">
            <Home size={18} /> Dashboard
          </Link>
          
          <Link to="/chat/lawyer/threads" className="text-white hover:text-gray-200 flex items-center gap-1">
            <MessageCircle size={18} /> Messages
          </Link>
          <button
            onClick={handleLogout}
            className=" cursor-pointer text-red-800 hover:text-red-400 flex items-center gap-1 font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white md:hidden focus:outline-none"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-blue-400 px-6 pb-4 flex flex-col gap-4">
          <Link to="/lawyer/profile" onClick={() => setMenuOpen(false)} className="text-white flex items-center gap-2">
            <User size={18} /> My Profile
            </Link>
          <Link to="/lawyer-dashboard" onClick={() => setMenuOpen(false)} className="text-white flex items-center gap-2">
            <Home size={18} /> Dashboard
          </Link>
          <Link to="/lawyer/appointments" onClick={() => setMenuOpen(false)} className="text-white flex items-center gap-2">
            <CalendarDays size={18} /> Appointments
          </Link>
          <Link to="/chat/lawyer/threads" onClick={() => setMenuOpen(false)} className="text-white flex items-center gap-2">
            <MessageCircle size={18} /> Messages
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-red-800 hover:text-red-400 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
