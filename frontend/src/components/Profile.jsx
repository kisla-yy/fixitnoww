import React from "react";

export default function Profile() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Profile</h2>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <p className="text-gray-700">
            <strong>Name:</strong> John Doe
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> admin@example.com
          </p>
          <p className="text-gray-700">
            <strong>Role:</strong> Super Admin
          </p>
        </div>
      </div>
    </div>
  );
}
