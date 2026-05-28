"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Favorite {
  id: string;
  business_id: string;
  business_name: string;
  business_type: string;
  business_image?: string;
  added_at: string;
}

export default function CustomerFavorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (!token || userRole !== "customer") {
      router.push("/customer/login");
      return;
    }

    fetchFavorites();
  }, [router]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else {
        setMessage({ type: "error", text: "Failed to load favorites" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while loading favorites" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!confirm("Are you sure you want to remove this from your favorites?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/favorites/${favoriteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
        setMessage({ type: "success", text: "Removed from favorites" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to remove favorite" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    }
  };

  if (isLoading) {
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-2">
            You can save up to 10 favorites ({favorites.length}/10)
          </p>
        </div>

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

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Start exploring and add your favorite businesses, specialists, and professionals
            </p>
            <Link
              href="/customer/dashboard"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Discover Businesses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Business Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200">
                  {favorite.business_image ? (
                    <Image
                      src={favorite.business_image}
                      alt={favorite.business_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-6xl">
                      {favorite.business_type === "restaurant" && "🍔"}
                      {favorite.business_type === "barbershop" && "✂️"}
                      {favorite.business_type === "local_store" && "🏪"}
                      {favorite.business_type === "pharmacy" && "💊"}
                      {favorite.business_type === "independent_worker" && "👨‍💼"}
                      {!["restaurant", "barbershop", "local_store", "pharmacy", "independent_worker"].includes(
                        favorite.business_type
                      ) && "🏢"}
                    </div>
                  )}
                </div>

                {/* Business Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {favorite.business_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 capitalize">
                    {favorite.business_type.replace("_", " ")}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/customer/business/${favorite.business_id}`}
                      className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Remove from favorites"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
