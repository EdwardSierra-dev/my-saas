"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BUSINESS_TYPES = [
  { value: "", label: "All Types" },
  { value: "barbershop", label: "Barbershop / Hair Salon" },
  { value: "spa", label: "Spa" },
  { value: "local_store", label: "Local Store" },
  { value: "restaurant", label: "Restaurant" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "independent_worker", label: "Independent Worker" },
];

const DEPARTMENTS = [
  { value: "", label: "All Departments" },
  { value: "Cundinamarca", label: "Cundinamarca" },
  { value: "Antioquia", label: "Antioquia" },
  { value: "Valle del Cauca", label: "Valle del Cauca" },
  { value: "Atlántico", label: "Atlántico" },
  { value: "Santander", label: "Santander" },
  // Add more as needed
];

interface Business {
  id: number;
  name: string;
  business_type: string;
  city: string;
  department: string;
  address: string | null;
  phone: string | null;
  is_active: boolean;
  rating: number | null;
  total_reviews: number;
  created_at: string;
}

export default function CustomerSearch() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    business_type: "",
    city: "",
    department: "",
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    
    if (!token || userRole !== "customer") {
      router.push("/customer/login");
      return;
    }
    
    setIsAuthenticated(true);
    // Load businesses on mount
    searchBusinesses();
  }, [router]);

  const searchBusinesses = async (page = 1) => {
    setIsLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pagination.page_size.toString(),
      });
      
      if (filters.query) params.append("query", filters.query);
      if (filters.business_type) params.append("business_type", filters.business_type);
      if (filters.city) params.append("city", filters.city);
      if (filters.department) params.append("department", filters.department);
      
      const response = await fetch(
        `http://localhost:8000/api/v1/businesses/search?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      
      const data = await response.json();
      setBusinesses(data.businesses);
      setPagination({
        page: data.page,
        page_size: data.page_size,
        total: data.total,
        total_pages: data.total_pages,
      });
    } catch (error) {
      console.error("Error searching businesses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBusinesses(1);
  };

  const handlePageChange = (newPage: number) => {
    searchBusinesses(newPage);
  };

  const getBusinessTypeLabel = (type: string) => {
    const found = BUSINESS_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  if (!isAuthenticated) {
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
              <h1 className="text-2xl font-bold text-gray-900">Discover Businesses</h1>
              <p className="text-sm text-gray-600">Find local businesses and specialists</p>
            </div>
            <Link
              href="/customer/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Query */}
              <div>
                <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name
                </label>
                <input
                  type="text"
                  id="query"
                  name="query"
                  value={filters.query}
                  onChange={handleFilterChange}
                  placeholder="e.g., Barbería..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Business Type */}
              <div>
                <label
                  htmlFor="business_type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Type
                </label>
                <select
                  id="business_type"
                  name="business_type"
                  value={filters.business_type}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="e.g., Bogotá"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found <span className="font-semibold">{pagination.total}</span> businesses
          </p>
        </div>

        {/* Business Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  href={`/customer/business/${business.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {business.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getBusinessTypeLabel(business.business_type)}
                      </p>
                    </div>
                    {business.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <span className="text-yellow-600">⭐</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {business.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>
                        {business.city}, {business.department}
                      </span>
                    </div>

                    {business.phone && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span>{business.phone}</span>
                      </div>
                    )}

                    {business.total_reviews > 0 && (
                      <div className="text-xs text-gray-500">
                        {business.total_reviews} reviews
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-primary-600 text-sm font-medium hover:text-primary-700">
                      View Details →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
