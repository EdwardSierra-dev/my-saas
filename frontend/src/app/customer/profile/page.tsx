"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setName(parsedUser.name);
    }
  }, [router]);

  const handleSave = async () => {
    if (!name.trim()) {
      setMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.name = name;
        localStorage.setItem("user", JSON.stringify(userData));
        
        setUser(userData);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.detail || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setIsEditing(false);
    setMessage(null);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/customer/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Profile Information</h1>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Name Field - Editable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                  {user.name}
                </div>
              )}
            </div>

            {/* Email Field - Non-editable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 flex items-center justify-between">
                <span>{user.email}</span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  Non-editable
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed for security reasons
              </p>
            </div>

            {/* Authentication Provider - Non-editable */}
            {user.auth_provider && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authentication Provider
                </label>
                <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 flex items-center justify-between">
                  <span className="capitalize">{user.auth_provider}</span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    Non-editable
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
