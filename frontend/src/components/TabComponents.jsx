import React from 'react';
import { Bell, User, Search, Settings, HelpCircle, MessageSquare, MapPin, Info, LogOut } from 'lucide-react';

export function NotificationsTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Notifications</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Bell size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">No new notifications right now.</p>
          <p className="text-gray-500 mt-2">We'll notify you when there are updates on your complaints.</p>
        </div>
      </div>
    </div>
  );
}

export function SettingsTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Settings</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
              <p className="text-gray-600">Manage how you receive updates about your complaints.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Privacy Settings</h3>
              <p className="text-gray-600">Control your privacy and data sharing preferences.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
              <p className="text-gray-600">Update your account information and preferences.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileTab() {
  const [profile, setProfile] = React.useState({ name: '', email: '' });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const ac = new AbortController();

    async function loadProfile() {
      try {
        const res = await fetch('https://fixitnoww-production.up.railway.app/api/me', {
          method: 'GET',
          credentials: 'include', // send cookies if using cookie-based auth
          signal: ac.signal,
          headers: { 'Accept': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Failed to load profile (${res.status})`);
        }

        const data = await res.json();
        setProfile({ name: data?.name ?? '', email: data?.email ?? '' });
      } catch (e) {
        if (e.name !== 'AbortError') {
          setError('Could not load profile');
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    return () => ac.abort();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {loading ? 'Loading…' : error ? '—' : profile.name || '—'}
              </h2>
              <p className="text-gray-600">Registered Citizen</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <p className="text-gray-800">
                {loading ? 'Loading…' : error ? '—' : profile.name || '—'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-800">
                {loading ? 'Loading…' : error ? '—' : profile.email || '—'}
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 mt-6">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function SearchTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Search</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search complaints, issues, or locations..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <p className="text-gray-500 text-center mt-4">Search for complaints, track issues, or find solutions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelpTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Help Center</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <HelpCircle className="mb-4 text-indigo-600" size={32} />
            <h3 className="text-lg font-semibold mb-2">Frequently Asked Questions</h3>
            <p className="text-gray-600">Find answers to common questions about filing complaints and tracking status.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <MessageSquare className="mb-4 text-indigo-600" size={32} />
            <h3 className="text-lg font-semibold mb-2">Contact Support</h3>
            <p className="text-gray-600">Get in touch with our support team for additional assistance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedbackTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Feedback</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-gray-600 mb-6">Help us improve Nagar Seva by sharing your feedback and suggestions.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Share your thoughts about the app..."
              />
            </div>
            <button
              onClick={() => alert('Feedback submitted successfully!')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NearbyTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Nearby Issues</h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">Map integration coming soon!</p>
          <p className="text-gray-500 mt-2">Soon you'll be able to see and track issues in your neighborhood.</p>
        </div>
      </div>
    </div>
  );
}

export function AboutTab() {
  return (
    <div className="w-full h-full p-6">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">About</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Nagar Seva</h2>
            <p className="text-gray-600 leading-relaxed">
              Nagar Seva is a citizen-centric platform designed to bridge the gap between 
              residents and local authorities. Our mission is to make civic engagement 
              simple, transparent, and effective.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold">User-Friendly</h4>
              <p className="text-gray-600 text-sm">Easy to use interface for all citizens</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Search size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold">Transparent</h4>
              <p className="text-gray-600 text-sm">Track your complaint status in real-time</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Bell size={24} className="text-indigo-600" />
              </div>
              <h4 className="font-semibold">Responsive</h4>
              <p className="text-gray-600 text-sm">Quick response from authorities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LogoutTab() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <LogOut size={64} className="mx-auto mb-6 text-gray-400" />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">You have logged out</h1>
        <p className="text-gray-600 text-lg">Thank you for using Nagar Seva. Redirecting to login...</p>
      </div>
    </div>
  );
}