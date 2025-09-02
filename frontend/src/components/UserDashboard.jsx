import React, { useState } from "react";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([
    { id: 1, title: "Pothole near main road", status: "Pending" },
    { id: 2, title: "Streetlight not working", status: "Resolved" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    image: null,
    voiceNote: null,
  });

  const handleRaiseComplaint = (e) => {
    e.preventDefault();
    if (!formData.description) {
      alert("Please describe your issue");
      return;
    }

    const newComplaint = {
      id: complaints.length + 1,
      title: formData.description,
      status: "Pending",
      image: formData.image,
      voiceNote: formData.voiceNote,
    };

    setComplaints([...complaints, newComplaint]);
    setFormData({ description: "", image: null, voiceNote: null });
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r p-4">
        <h2 className="text-lg font-semibold mb-4">My Complaints</h2>
        <ul className="space-y-2">
          {complaints.map((c) => (
            <li
              key={c.id}
              className="p-3 rounded-md bg-white shadow hover:shadow-md transition"
            >
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-gray-500">Status: {c.status}</p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>

        <button
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Raise a Complaint
        </button>

        {/* Complaint Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Raise a Complaint</h2>

              <form onSubmit={handleRaiseComplaint} className="space-y-4">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Describe your issue
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Write your complaint..."
                    rows="3"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload / Take a Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment" // opens camera on mobile
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="w-full"
                  />
                </div>

                {/* Voice Note Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload a Voice Note
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) =>
                      setFormData({ ...formData, voiceNote: e.target.files[0] })
                    }
                    className="w-full"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Submit Complaint
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
