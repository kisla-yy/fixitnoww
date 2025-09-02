// src/App.jsx
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import IssueList from "./components/IssueList";
import MapModal from "./components/MapModal";
import mockIssues from "./data/mockIssues.js";

import Navbar from "./components/Navbar";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";

const CATEGORIES = ["All Issues", "Potholes", "Electric Lights"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All Issues");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const showMapBtnRef = useRef(null);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar visible on all pages */}
        <Navbar />

        <div className="flex-1 flex">
          {/* Sidebar for issues */}
          <Sidebar
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onChange={(cat) => setActiveCategory(cat)}
          />

          <main className="flex-1 p-6">
            <Routes>
              {/* Admin dashboard */}
              <Route
                path="/"
                element={
                  <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <h2 className="text-xl font-semibold">Issues</h2>

                      <div className="w-full sm:w-auto">
                        <button
                          ref={showMapBtnRef}
                          onClick={() => setIsMapOpen(true)}
                          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 text-white rounded-lg shadow-md font-semibold transition"
                          aria-haspopup="dialog"
                        >
                          Show Map
                        </button>
                      </div>
                    </div>

                    <IssueList
                      issues={mockIssues}
                      activeCategory={activeCategory}
                    />
                  </div>
                }
              />

              {/* Auth routes */}
              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<UserRegister />} />
            </Routes>
          </main>
        </div>

        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          triggerRef={showMapBtnRef}
        />
      </div>
    </Router>
  );
}
