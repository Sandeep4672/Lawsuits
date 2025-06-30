import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, XCircle, FilePlus, Users, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function AdminNavbar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-800 text-white z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/admin/dashboard" className="text-xl font-bold tracking-wide flex items-center gap-2">
          ⚖️ AdminPanel
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/admin/dashboard" className="hover:text-gray-300 flex items-center gap-1">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/lawyers" className="hover:text-gray-300 flex items-center gap-1">
            <Users size={18} /> Lawyers
          </Link>
          <Link to="/admin/add-case" className="hover:text-gray-300 flex items-center gap-1">
            <FilePlus size={18} /> Add Case
          </Link>
          <button
            onClick={handleLogout}
            className=" cursor-pointer text-red-400 hover:text-red-600 flex items-center gap-1 font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <XCircle size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-slate-700 px-6 py-4 flex flex-col gap-4 text-sm">
          <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/lawyers" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <Users size={18} /> Lawyers
          </Link>
          <Link to="/admin/add-case" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
            <FilePlus size={18} /> Add Case
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-red-400 hover:text-red-600 flex items-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
