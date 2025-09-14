import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MapsTab from "./MapsTab";
import Settings from "./Settings";
import ManageTasks from "./ManageTasks";
import Profile from "./Profile";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all-issues");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "all-issues") setSelectedIssue(null);
  }, [activeTab]);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/complaints", {
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

// Update issue status
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

    // ✅ If complaint is fulfilled, remove from list
    if (updated.status === "fulfilled") {
      setIssues((prev) => prev.filter((i) => i._id !== updated._id));
    } else {
      // Otherwise update it in place
      setIssues((prev) =>
        prev.map((i) => (i._id === updated._id ? updated : i))
      );
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  // Calculate counts dynamically
  const counts = issues.reduce(
    (acc, issue) => {
      const cat = issue.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + 1;
      acc.All = (acc.All || 0) + 1;
      return acc;
    },
    { All: 0 }
  );

  // Filter issues by active category (case-insensitive)
  const filtered =
    activeCategory === "All"
      ? issues
      : issues.filter(
        (i) =>
          i.category &&
          i.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
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
              filtered.map((issue) => (
                <div
                  key={issue._id}
                  className="bg-white p-4 mb-3 shadow rounded flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{issue.text || issue.title}</h3>
                    <p>Category: {issue.category}</p>
                    <p>Status: {issue.status}</p>
                    <p>
                      Reported At:{" "}
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleString()
                        : "N/A"}
                    </p>

                    {/* ✅ Show Cloudinary Image if available */}
                    {issue.imagePath && (
                      <img
                        src={issue.imagePath}
                        alt="Complaint"
                        className="mt-2 w-40 h-32 object-cover rounded border"
                      />
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setActiveTab("maps");
                      }}
                    >
                      View on Map
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        handleChangeStatus(
                          issue._id,
                          issue.status === "pending" ? "fulfilled" : "pending"
                        )
                      }
                    >
                      {issue.status === "pending"
                        ? "Mark Fulfilled"
                        : "Mark Pending"}
                    </button>
                  </div>
                </div>
              ))
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
    </div>
  );
}
