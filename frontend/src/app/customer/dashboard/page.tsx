"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    const userData = localStorage.getItem("user");

    if (!token || userRole !== "customer") {
      router.push("/customer/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user");
    router.push("/customer/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🎉 Welcome to Your Dashboard!
          </h2>
          <p className="text-gray-600 mb-4">
            Your customer account has been successfully created. Here you'll be able to:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Browse and search for businesses and specialists
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Save your favorite businesses (up to 10)
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              View your purchase history
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Chat with businesses and specialists
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Track your deliveries in real-time
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Leave reviews and ratings
            </li>
          </ul>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Account Status:</span>
              <p className="text-gray-900">
                {user.is_verified ? (
                  <span className="text-green-600">✓ Verified</span>
                ) : (
                  <span className="text-yellow-600">⚠ Not Verified</span>
                )}
              </p>
            </div>
            {user.preferences && user.preferences.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Your Interests:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.preferences.map((pref: string) => (
                    <span
                      key={pref}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {pref.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Businesses</h3>
            <p className="text-sm text-gray-600">
              Find local businesses and specialists near you
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Favorites</h3>
            <p className="text-sm text-gray-600">
              Save and manage your favorite businesses
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchase History</h3>
            <p className="text-sm text-gray-600">
              View all your past orders and services
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-sm text-gray-600">
              Chat with businesses about your orders
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Deliveries</h3>
            <p className="text-sm text-gray-600">
              Monitor your orders in real-time
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
            <p className="text-sm text-gray-600">
              Share your experience with others
            </p>
            <span className="inline-block mt-3 text-xs text-primary-600 font-semibold">
              Coming Soon
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
