import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import Sidebar from "./components/Sidebar";
import IssueList from "./components/IssueList";
import MapModal from "./components/MapModal";
import mockIssues from "./data/mockIssues.js";

import Navbar from "./components/Navbar";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import Welcome from "./components/Welcome";
import AdminLogin from "./components/AdminLogin";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";

const CATEGORIES = ["All Issues", "Potholes", "Electric Lights"];

// ✅ PrivateRoute with loading state
function PrivateRoute({ isAuthenticated, loading, children }) {
  if (loading) return <div>Loading...</div>; // or spinner
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Layout
function Layout({ children, isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const fullPageRoutes = ["/login", "/register", "/admin-login"];
  const isFullPage = fullPageRoutes.includes(location.pathname);

  if (isFullPage) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Issues");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const showMapBtnRef = useRef(null);

  const [user, setUser] = useState(null); // null = not logged in
  const [loading, setLoading] = useState(true); // ✅ loading state
  const isAuthenticated = !!user;

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);
  

  // ✅ Session check on page load
  useEffect(() => {
    axios
      .get("/auth/session-check", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        else setUser(null);
      })
      .catch((err) => {
        console.error("Session check error:", err);
        setUser(null);
      })
      .finally(() => setLoading(false)); // ✅ finished checking session
  }, []);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setUser}>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<UserLogin onLogin={handleLogin} />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={setUser} />} />

          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                loading={loading}
              >
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                loading={loading}
              >
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/issues"
            element={
              <div className="max-w-7xl mx-auto p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold">Issues</h2>
                  <div className="w-full sm:w-auto">
                    <button
                      ref={showMapBtnRef}
                      onClick={() => setIsMapOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md font-semibold transition"
                      aria-haspopup="dialog"
                    >
                      Show Map
                    </button>
                  </div>
                </div>
                <IssueList issues={mockIssues} activeCategory={activeCategory} />
              </div>
            }
          />
        </Routes>

        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          triggerRef={showMapBtnRef}
        />
      </Layout>
    </Router>
  );
}
