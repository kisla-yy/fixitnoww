// src/App.jsx
import React, { useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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
import AdminDashboard from "./components/AdminDashboard"; // ✅ create this

const CATEGORIES = ["All Issues", "Potholes", "Electric Lights"];

// ✅ Private Route wrapper
function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// ✅ Layout wrapper
function Layout({ children, isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();

  // Routes with NO Navbar + NO Sidebar
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

  // ✅ Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Layout
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* Public Pages */}
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/login"
            element={<UserLogin setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/register" element={<UserRegister />} />
          <Route
            path="/admin-login"
            element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* ✅ Protected User Dashboard */}
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* ✅ Protected Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  isMapOpen={isMapOpen}
                  setIsMapOpen={setIsMapOpen}
                  showMapBtnRef={showMapBtnRef}
                />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
