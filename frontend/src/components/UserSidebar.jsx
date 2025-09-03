import React from 'react';
import { Home, User, Search, List, Bell, Settings, HelpCircle, MessageSquare, MapPin, Info, LogOut } from "lucide-react";

export default function UserSidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab }) {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "Profile", icon: User },
    { id: "search", label: "Search", icon: Search },
    { id: "complaints", label: "My Complaints", icon: List },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Help Center", icon: HelpCircle },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "nearby", label: "Nearby Issues", icon: MapPin },
    { id: "about", label: "About", icon: Info },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const renderMenu = (mobile = false) => (
    <nav className="flex-1 p-4 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (mobile) setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-300 border-l-4 ${
              isActive
                ? "bg-white text-violet-700 font-semibold border-violet-500 shadow-sm"
                : "text-white border-transparent hover:bg-violet-100/10"
            }`}
          >
            <Icon size={20} className={isActive ? "text-violet-600" : ""} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-violet-600 to-purple-600 text-white">
        {renderMenu()}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-violet-600 to-purple-600 text-white">
            <div className="mt-4">{renderMenu(true)}</div>
          </div>
        </div>
      )}
    </>
  );
}
