import React from 'react';

export default function ComplaintsTab({ complaints, setIsFormOpen }) {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">My Complaints</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {complaints.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500"
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{c.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.status === 'Resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        {complaints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No complaints filed yet.</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              File Your First Complaint
            </button>
          </div>
        )}
      </div>
    </div>
  );
}