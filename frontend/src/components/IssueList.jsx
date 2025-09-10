import React from "react";
import IssueCard from "./IssueCard";

export default function IssueList({ issues, category, count, onView }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {category} Issues ({count})
      </h2>
      <ul className="space-y-4">
        {issues.map((issue) => (
          <li key={issue.id}>
            <IssueCard issue={issue} onView={onView} />
          </li>
        ))}
      </ul>
    </div>
  );
}
