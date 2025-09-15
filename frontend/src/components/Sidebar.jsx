import React, { useState } from "react";
import { MapPin, List, Settings, ClipboardList, ChevronDown, User } from "lucide-react";

export default function Sidebar({ activeTab, onChange, activeCategory, onCategoryChange, counts }) {
  const [isIssueOpen, setIsIssueOpen] = useState(true);
  const categories = ["All", "Electricity", "Transportation", "Accidents", "Potholes", "Road Blockage"];

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 text-xl font-bold border-b">Admin Dashboard</div>
      <nav className="flex-1 p-2 space-y-2">
        {/* Maps */}
        <button
          onClick={() => onChange("maps")}
          className={`flex items-center w-full px-3 py-2 rounded-md ${
            activeTab === "maps" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          <MapPin className="mr-2 h-5 w-5" /> Maps
        </button>

        {/* All Issues */}
        <div>
          <button
            onClick={() => { setIsIssueOpen(!isIssueOpen); onChange("all-issues"); }}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <span className="flex items-center">
              <List className="mr-2 h-5 w-5" /> All Issues
            </span>
            <ChevronDown className={`h-4 w-4 transform transition ${isIssueOpen ? "rotate-180" : ""}`} />
          </button>
          {isIssueOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { onChange("all-issues"); onCategoryChange(cat); }}
                  className={`flex justify-between w-full text-left px-2 py-1 rounded-md text-sm ${
                    activeTab === "all-issues" && activeCategory === cat
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-gray-500">({counts[cat] || 0})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manage Tasks */}
        <button
          onClick={() => onChange("manage-tasks")}
          className={`flex items-center w-full px-3 py-2 rounded-md ${
            activeTab === "manage-tasks" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          <ClipboardList className="mr-2 h-5 w-5" /> Manage Tasks
        </button>

        {/* Settings */}
        <button
          onClick={() => onChange("settings")}
          className={`flex items-center w-full px-3 py-2 rounded-md ${
            activeTab === "settings" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          <Settings className="mr-2 h-5 w-5" /> Settings
        </button>

        {/* Profile */}
        <button
          onClick={() => onChange("profile")}
          className={`flex items-center w-full px-3 py-2 rounded-md ${
            activeTab === "profile" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
          }`}
        >
          <User className="mr-2 h-5 w-5" /> Profile
        </button>
      </nav>
    </div>
  );
}
