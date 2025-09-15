// src/components/Header.jsx
import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>
      </div>
    </header>
  )
}
