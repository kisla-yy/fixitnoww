// src/UserDashboard.jsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import UserSidebar from "./UserSidebar";
import HomeTab from "./HomeTab";
import ComplaintsTab from "./ComplaintsTab";
import {
  NotificationsTab,
  SettingsTab,
  ProfileTab,
  SearchTab,
  HelpTab,
  FeedbackTab,
  NearbyTab,
  AboutTab,
  LogoutTab
} from "./TabComponents";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Pothole near main road", status: "Pending" },
    { id: 2, title: "Streetlight not working", status: "Resolved" }
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRaiseComplaint = (e) => {
    e.preventDefault();
    // ...create and add complaint...
    setIsFormOpen(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab setIsFormOpen={setIsFormOpen} />;
      case "complaints":
        return <ComplaintsTab complaints={complaints} setIsFormOpen={setIsFormOpen} />;
      case "notifications":
        return <NotificationsTab />;
      case "settings":
        return <SettingsTab />;
      case "profile":
        return <ProfileTab />;
      case "search":
        return <SearchTab />;
      case "help":
        return <HelpTab />;
      case "feedback":
        return <FeedbackTab />;
      case "nearby":
        return <NearbyTab />;
      case "about":
        return <AboutTab />;
      case "logout":
        return <LogoutTab />;
      default:
        return <HomeTab setIsFormOpen={setIsFormOpen} />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <UserSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-violet-600 text-white p-4">
          <h2 className="text-lg font-bold">Nagar Seva</h2>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-hidden">
          {renderActiveTab()}
        </div>
      </main>

      {/* Complaint Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* form fields */}
            <button onClick={() => setIsFormOpen(false)}>Cancel</button>
            <button onClick={handleRaiseComplaint}>Submit Complaint</button>
          </div>
        </div>
      )}
    </div>
  );
}
