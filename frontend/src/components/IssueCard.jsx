import React from "react";

export default function IssueCard({ issue, onView }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold">{issue.title}</h3>
      <p className="text-gray-600">{issue.description}</p>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Category: {issue.category}</span>
        <span>Reported: {new Date(issue.reportedAt).toLocaleString()}</span>
      </div>

      {/* View button */}
      <button
        onClick={() => onView(issue)}
        className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View on Map
      </button>
    </div>
  );
}
