import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check session from backend
  const checkSession = async () => {
    try {
      const res = await axios.get("http://localhost:5000/session-check", {
        withCredentials: true,
      });
      setIsLoggedIn(res.data.loggedIn);
    } catch (err) {
      console.error("Session check failed:", err);
      setIsLoggedIn(false);
    }
  };

  // Run on mount and every 2 seconds to auto-update login status
  useEffect(() => {
    checkSession(); // initial check
    const interval = setInterval(checkSession, 2000); // poll every 2s
    return () => clearInterval(interval); // cleanup
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/signout", { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          FixItNow
        </Link>

        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:text-gray-200 transition-colors duration-200"
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

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-4 space-y-3">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block hover:text-gray-200 transition-colors duration-200"
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
