import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MapsTab from "./MapsTab";
import Settings from "./Settings";
import ManageTasks from "./ManageTasks";
import Profile from "./Profile";
import ChatBot from "./ChatBot"; // ✅ import ChatBot

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all-issues");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "all-issues") setSelectedIssue(null);
  }, [activeTab]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("https://fixitnoww-production.up.railway.app/api/admin/complaints", {
          credentials: "include",
        });
        const data = await res.json();

        const normalized = data.map((issue) => ({
          ...issue,
          lat: issue.location?.lat ?? null,
          lng: issue.location?.lng ?? null,
          category: issue.category ? issue.category.trim() : "Uncategorized",
          status: issue.status || "pending",
        }));

        setIssues(normalized);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleChangeStatus = async (issueId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/complaints/${issueId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      if (updated.status === "fulfilled") {
        setIssues((prev) => prev.filter((i) => i._id !== updated._id));
      } else {
        setIssues((prev) =>
          prev.map((i) => (i._id === updated._id ? updated : i))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const counts = issues.reduce(
    (acc, issue) => {
      const cat = issue.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      acc.All = (acc.All || 0) + 1;
      return acc;
    },
    { All: 0 }
  );

  const filtered =
    activeCategory === "All"
      ? issues
      : issues.filter(
          (i) =>
            i.category &&
            i.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <Sidebar
          activeTab={activeTab}
          onChange={setActiveTab}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {activeTab === "all-issues" && (
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p>Loading complaints...</p>
            ) : filtered.length === 0 ? (
              <p>No complaints in this category.</p>
            ) : (
              <div className="space-y-4">
                {filtered.map((issue) => (
                  <div
                    key={issue._id}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex items-start gap-4"
                  >
                    {/* Image */}
                    {issue.imageUrl && (
                      <img
                        src={issue.imageUrl}
                        alt="Complaint"
                        className="w-40 h-32 object-cover rounded-md border flex-shrink-0"
                      />
                    )}

                    {/* Info & buttons */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {issue.text || issue.title}
                        </h3>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {issue.category}
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              issue.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : issue.status === "fulfilled"
                                ? "bg-green-100 text-green-800"
                                : issue.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {issue.status}
                          </span>
                        </div>

                        <p className="text-gray-500 text-sm mb-2">
                          Reported At:{" "}
                          {issue.createdAt
                            ? new Date(issue.createdAt).toLocaleString()
                            : "N/A"}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4 mt-1">
                        <button
                          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setActiveTab("maps");
                          }}
                        >
                          View on Map
                        </button>
                        <button
                          className="flex-1 bg-green-500 text-white px-1 py-1 rounded-md hover:bg-green-600 transition"
                          onClick={() =>
                            handleChangeStatus(
                              issue._id,
                              issue.status === "pending"
                                ? "fulfilled"
                                : "pending"
                            )
                          }
                        >
                          {issue.status === "pending"
                            ? "Mark Fulfilled"
                            : "Mark Pending"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "maps" && (
          <div className="flex-1">
            <MapsTab
              issues={issues.filter((i) => i.lat !== null && i.lng !== null)}
              selectedIssue={selectedIssue}
            />
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
