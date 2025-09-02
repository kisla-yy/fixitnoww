import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // npm install lucide-react

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login state
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          FixItNow
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-white text-red-600 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-4 py-1 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-4 space-y-3">
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition w-full text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-gray-200 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
