import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

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

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function Layout({ children, isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const fullPageRoutes = ["/login", "/register", "/admin-login"];
  const isFullPage = fullPageRoutes.includes(location.pathname);

  if (isFullPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Issues");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const showMapBtnRef = useRef(null);

  const [user, setUser] = useState(null); // null = not logged in
  const isAuthenticated = !!user;

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setUser}>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* Public Pages */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<UserLogin onLogin={handleLogin} />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} redirectTo="/admin-login">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* Issues Page */}
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
