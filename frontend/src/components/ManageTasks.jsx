import React from "react";

export default function ManageTasks() {
  const tasks = [
    { id: 1, task: "Assign road repair team", status: "Pending" },
    { id: 2, task: "Follow up garbage collection", status: "In Progress" },
    { id: 3, task: "Inspect broken street lights", status: "Completed" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="bg-white shadow rounded-lg p-4 flex justify-between items-center"
          >
            <span>{t.task}</span>
            <span
              className={`px-2 py-1 text-sm rounded ${
                t.status === "Pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : t.status === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
