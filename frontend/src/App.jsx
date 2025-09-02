// src/App.jsx
import React, { useState, useRef } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import IssueList from './components/IssueList'
import MapModal from './components/MapModal'
import mockIssues from './data/mockIssues.js'

const CATEGORIES = ['All Issues', 'Potholes', 'Electric Lights']

export default function App() {
  const [activeCategory, setActiveCategory] = useState('All Issues')
  const [isMapOpen, setIsMapOpen] = useState(false)
  const showMapBtnRef = useRef(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar receives current category and a setter */}
        <Sidebar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onChange={(cat) => setActiveCategory(cat)}
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Issues</h2>

              <div className="w-full sm:w-auto">
                <button
                  ref={showMapBtnRef}
                  onClick={() => setIsMapOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 text-white rounded-lg shadow-md font-semibold transition"
                  aria-haspopup="dialog"
                >
                  Show Map
                </button>
              </div>
            </div>

            <IssueList issues={mockIssues} activeCategory={activeCategory} />
          </div>
        </main>
      </div>

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        triggerRef={showMapBtnRef}
      />
    </div>
  )
}


