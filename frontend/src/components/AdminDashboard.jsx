import React, { useState, useRef } from "react";
import Header from "./Header";
import IssueList from "./IssueList";
import MapModal from "./MapModal";
import Sidebar from "./Sidebar";

export default function AdminDashboard() {
  // Categories for Sidebar
  const categories = ["All Issues", "Road", "Sanitation", "Electricity"];

  // Dummy issues (replace with API later)
  const [issues] = useState([
    {
      id: 1,
      title: "Pothole near main street",
      description: "Large pothole blocking the road.",
      category: "Road",
      reportedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Garbage collection delayed",
      description: "Garbage not collected in Sector 5 for 3 days.",
      category: "Sanitation",
      reportedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Street light not working",
      description: "Street light out near park area.",
      category: "Electricity",
      reportedAt: new Date().toISOString(),
    },
  ]);

  // Sidebar filter state
  const [activeCategory, setActiveCategory] = useState("All Issues");

  // Map modal state + selected issue + triggerRef for focus restore
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const triggerRef = useRef(null);

  // Called from IssueList (issue, triggerElement)
  const handleViewOnMap = (issue, triggerElement) => {
    // save the element that opened the modal so focus can be restored
    triggerRef.current = triggerElement || null;
    setSelectedIssue(issue);
    setIsMapOpen(true);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-4 space-y-6">
          {/* Issues List */}
          <IssueList
            issues={issues}
            activeCategory={activeCategory}
            onViewMap={handleViewOnMap}
          />

          {/* Map Modal */}
          <MapModal
            isOpen={isMapOpen}
            onClose={() => {
              setIsMapOpen(false);
              setSelectedIssue(null);
            }}
            location={{ lat: 28.6139, lng: 77.2090 }}
            triggerRef={triggerRef}
            issue={selectedIssue}
          />
        </div>
      </div>
    </div>
  );
}
