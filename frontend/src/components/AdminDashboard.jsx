// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import IssueList from "./IssueList";
import Settings from "./Settings";
import ManageTasks from "./ManageTasks";
import MapsTab from "./MapsTab";
import Profile from "./Profile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all-issues");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Reset selectedIssue when user directly goes to All Issues
  useEffect(() => {
    if (activeTab === "all-issues") {
      setSelectedIssue(null);
    }
  }, [activeTab]);

  // Dummy issues
  const issues = [
    {
      id: 1,
      title: "Street light not working",
      description: "Near park.",
      category: "Electricity",
      reportedAt: "2025-09-10T08:30:00Z",
      lat: 28.6139,
      lng: 77.209,
    },
    {
      id: 2,
      title: "Bus breakdown",
      description: "Sector 7.",
      category: "Transportation",
      reportedAt: "2025-09-09T15:45:00Z",
      lat: 28.7041,
      lng: 77.1025,
    },
    {
      id: 3,
      title: "Accident at junction",
      description: "Main Junction.",
      category: "Accidents",
      reportedAt: "2025-09-08T12:10:00Z",
      lat: 28.5355,
      lng: 77.391,
    },
    {
      id: 4,
      title: "Pothole near school",
      description: "Blocking traffic.",
      category: "Potholes",
      reportedAt: "2025-09-07T09:00:00Z",
      lat: 28.4595,
      lng: 77.0266,
    },
    {
      id: 5,
      title: "Road Blockage",
      description: "Tree fell down.",
      category: "Road Blockage",
      reportedAt: "2025-09-06T20:00:00Z",
      lat: 28.4089,
      lng: 77.3178,
    },
  ];

  // Count by category
  const counts = issues.reduce(
    (acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      acc.All = (acc.All || 0) + 1;
      return acc;
    },
    { All: 0 }
  );

  // Filtered issues
  const filtered =
    activeCategory === "All"
      ? issues
      : issues.filter((i) => i.category === activeCategory);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar always visible */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar
          activeTab={activeTab}
          onChange={setActiveTab}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {activeTab === "all-issues" && (
          <div className="flex-1 overflow-y-auto p-6">
            <IssueList
              issues={filtered}
              category={activeCategory}
              count={counts[activeCategory]}
              onView={(issue) => {
                setSelectedIssue(issue);
                setActiveTab("maps"); // go to maps
              }}
            />
          </div>
        )}

        {activeTab === "maps" && (
          <div className="flex-1">
            <MapsTab issues={issues} selectedIssue={selectedIssue} />
          </div>
        )}

        {activeTab === "manage-tasks" && (
          <div className="flex-1 overflow-y-auto p-6">
            <ManageTasks />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex-1 overflow-y-auto p-6">
            <Settings />
          </div>
        )}

        {activeTab === "profile" && (
          <div className="flex-1 overflow-y-auto p-6">
            <Profile />
          </div>
        )}
      </div>
    </div>
  );
}
