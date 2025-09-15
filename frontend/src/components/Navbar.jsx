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
      const res = await axios.get("https://fixitnoww-production.up.railway.app/api/session-check", {
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
    checkSession();
    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("https://fixitnoww-production.up.railway.app/api/auth/userSignout", { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/welcome");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wide">
          NagarSeva
        </Link>

        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg transition-all font-medium"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg transition-all font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-violet-700 px-4 py-2 rounded-lg font-semibold shadow-sm border-2 border-violet-100 hover:bg-violet-50 hover:text-violet-800 hover:border-violet-200 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-violet-700 to-purple-700 px-6 py-4 space-y-3">
          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="block w-full px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full bg-white text-violet-700 px-4 py-2 rounded-lg font-semibold shadow-sm border-2 border-violet-100 hover:bg-violet-50 hover:text-violet-800 hover:border-violet-200 transition-all mt-1"
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
