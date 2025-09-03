// src/components/Welcome.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    // Make this element fill the remaining space and center its content
    <div className="flex-1 flex items-center justify-center">
      {/* container that limits width and centers content */}
      <div className="w-full max-w-3xl px-6 py-12">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome to the Civic Complaint Portal
          </h1>
          <p className="text-gray-600 max-w-lg mb-8">
            Easily report civic issues like potholes, streetlights, and more.
            Choose how you want to continue below.
          </p>

          {/* Options — stacked on small screens, side-by-side on >=sm */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
            {/* User Option */}
            <div className="flex-1 p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">For Citizens</h2>
              <p className="text-gray-500 mb-4">
                Report civic issues in your area and track complaint status.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Login as User
              </Link>
            </div>

            {/* Admin Option */}
            <div className="flex-1 p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">For Admins</h2>
              <p className="text-gray-500 mb-4">
                Manage, verify and resolve reported civic issues in your region.
              </p>
              <Link
                to="/admin-login"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Login as Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
