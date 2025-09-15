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
  LogoutTab,
} from "./TabComponents";
import ChatBot from "./ChatBot"; // ✅ import chatbot

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Pothole near main road", status: "Pending" },
    { id: 2, title: "Streetlight not working", status: "Resolved" },
  ]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    // ...create and add complaint...
    setIsFormOpen(false);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab setIsFormOpen={setIsFormOpen} />;
      case "complaints":
        return (
          <ComplaintsTab
            complaints={complaints}
            setIsFormOpen={setIsFormOpen}
          />
        );
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
    <div className="flex h-screen relative">
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
        <div className="flex-1 overflow-hidden">{renderActiveTab()}</div>
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

      {/* ✅ Floating ChatBot */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group">
          {/* Pulsing background */}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 group-hover:opacity-40 animate-ping"></div>

          {/* Chat Button */}
          <button className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 shadow-lg hover:scale-110 transition-transform duration-300">
            💬
          </button>

          {/* Chatbot Box */}
          <div className="absolute bottom-16 right-0 hidden group-hover:block">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  );
}
