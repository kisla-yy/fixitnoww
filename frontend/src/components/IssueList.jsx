// src/components/IssueList.jsx
import React from 'react'

export default function IssueList({ issues = [], activeCategory = 'All Issues' }) {
  const filtered =
    activeCategory === 'All Issues'
      ? issues
      : issues.filter((it) => it.category === activeCategory)

  return (
    <section aria-labelledby="issues-heading">
      <h3 id="issues-heading" className="sr-only">
        Issues list
      </h3>

      {filtered.length === 0 ? (
        <div className="rounded-lg bg-white p-6 shadow-sm text-center">No issues to show.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <article
              key={issue.id}
              className="bg-white rounded-lg p-4 shadow-sm"
              aria-labelledby={`issue-${issue.id}-title`}
            >
              <div className="flex items-start justify-between">
                <h4 id={`issue-${issue.id}-title`} className="text-sm font-semibold">
                  {issue.title}
                </h4>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {issue.category}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">{issue.description}</p>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <time dateTime={issue.reportedAt}>{new Date(issue.reportedAt).toLocaleString()}</time>
                <button className="text-indigo-600 hover:underline text-sm">View</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
