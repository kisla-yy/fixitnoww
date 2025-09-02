// src/components/Sidebar.jsx
import React, { useState } from 'react'

export default function Sidebar({ categories = [], activeCategory, onChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSelect = (cat) => {
    onChange(cat)
    setMobileOpen(false)
  }

  return (
    <nav aria-label="Issue categories" className="sm:w-64 flex-shrink-0">
      {/* Desktop sidebar */}
      <div className="hidden sm:block h-full border-r bg-white">
        <ul className="p-4 space-y-1">
          {categories.map((cat) => {
            const isActive = cat === activeCategory
            return (
              <li key={cat}>
                <button
                  onClick={() => onChange(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-50 border-l-4 border-indigo-500 font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span>{cat}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mobile top control */}
      <div className="sm:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-medium">{activeCategory}</div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open categories"
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile off-canvas */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Categories</h3>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close categories"
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <ul className="space-y-2">
              {categories.map((cat) => {
                const isActive = cat === activeCategory
                return (
                  <li key={cat}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md ${
                        isActive ? 'bg-indigo-50 font-medium' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleSelect(cat)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      {cat}
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>
      )}
    </nav>
  )
}
