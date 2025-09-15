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
import ComplaintsTab from "./components/ComplaintsTab";

function PrivateRoute({ isAuthenticated, loading, children }) {
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

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

function App() {
  const [activeCategory, setActiveCategory] = useState("All Issues");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const showMapBtnRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/session-check", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) setUser(res.data.user);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setUser}>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<UserLogin onLogin={setUser} />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={setUser} />} />
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
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
          <Route path="/complaint-form" element={<ComplaintsTab />} />
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

export default App;



