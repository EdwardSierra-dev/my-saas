"use client";

import { useState } from "react";

interface AnalyticsModuleProps {
  tier: "basic" | "advanced" | "premium";
}

// Mock data for demonstration
const mockData = {
  revenue: {
    today: 450000,
    week: 2850000,
    month: 12500000,
    growth: 12.5,
  },
  orders: {
    today: 23,
    week: 156,
    month: 687,
    completed: 645,
    pending: 42,
  },
  customers: {
    total: 1247,
    new: 45,
    returning: 892,
    churnRate: 3.2,
  },
  topProducts: [
    { name: "Corte de Cabello Clásico", sales: 234, revenue: 5850000 },
    { name: "Shampoo Profesional", sales: 156, revenue: 7020000 },
    { name: "Tinte para Cabello", sales: 89, revenue: 7120000 },
    { name: "Manicure Completo", sales: 178, revenue: 6230000 },
    { name: "Tratamiento Capilar", sales: 67, revenue: 4690000 },
  ],
  salesTrend: [
    { date: "Mon", amount: 380000 },
    { date: "Tue", amount: 420000 },
    { date: "Wed", amount: 390000 },
    { date: "Thu", amount: 510000 },
    { date: "Fri", amount: 680000 },
    { date: "Sat", amount: 750000 },
    { date: "Sun", amount: 520000 },
  ],
};

export default function AnalyticsModule({ tier }: AnalyticsModuleProps) {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const getRevenue = () => {
    switch (period) {
      case "today":
        return mockData.revenue.today;
      case "week":
        return mockData.revenue.week;
      case "month":
        return mockData.revenue.month;
      default:
        return mockData.revenue.today;
    }
  };

  const getOrders = () => {
    switch (period) {
      case "today":
        return mockData.orders.today;
      case "week":
        return mockData.orders.week;
      case "month":
        return mockData.orders.month;
      default:
        return mockData.orders.today;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              {tier === "basic" && "Basic Analytics"}
              {tier === "advanced" && "Advanced Analytics"}
              {tier === "premium" && "Premium Analytics"}
            </p>
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("today")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === "today"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === "week"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                period === "month"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* KPI Cards - Available in all tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${getRevenue().toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-2">
              ↑ {mockData.revenue.growth}% vs last {period}
            </p>
          </div>

          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Orders</p>
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{getOrders()}</p>
            <p className="text-sm text-gray-600 mt-2">
              {mockData.orders.completed} completed
            </p>
          </div>

          {/* Customers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Active Customers</p>
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {mockData.customers.total.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {mockData.customers.new} new this {period}
            </p>
          </div>

          {/* Average Ticket Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg. Ticket</p>
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${Math.round(getRevenue() / getOrders()).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">Per order</p>
          </div>
        </div>

        {/* Sales Trend Chart - Basic */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Trend (Last 7 Days)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockData.salesTrend.map((day, index) => {
              const maxAmount = Math.max(...mockData.salesTrend.map((d) => d.amount));
              const height = (day.amount / maxAmount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary-600 rounded-t-lg hover:bg-primary-700 transition-colors cursor-pointer relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${day.amount.toLocaleString()}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{day.date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products Table - Basic */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 10 Products/Services
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product/Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockData.topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.sales}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${product.revenue.toLocaleString()} COP
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advanced Features - Only for Advanced and Premium */}
        {(tier === "advanced" || tier === "premium") && (
          <>
            {/* Customer Retention */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Retention
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Returning Customers</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {((mockData.customers.returning / mockData.customers.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(mockData.customers.returning / mockData.customers.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Churn Rate</span>
                      <span className="text-sm font-semibold text-red-600">
                        {mockData.customers.churnRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${mockData.customers.churnRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Customer Lifetime Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      $2,450,000 COP
                    </p>
                  </div>
                </div>
              </div>

              {/* Inventory Performance */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Inventory Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Products</span>
                    <span className="text-lg font-bold text-gray-900">247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-600">Low Stock Items</span>
                    <span className="text-lg font-bold text-yellow-600">12</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Inventory Turnover</span>
                    <span className="text-lg font-bold text-green-600">4.2x</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Avg. Profit Margin</span>
                    <span className="text-lg font-bold text-blue-600">28.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Premium Features - Only for Premium */}
        {tier === "premium" && (
          <>
            {/* AI Predictions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow p-6 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-purple-900">
                  AI Sales Predictions
                </h3>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  PREMIUM
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Next Week Forecast</p>
                  <p className="text-2xl font-bold text-purple-600">
                    $3,200,000
                  </p>
                  <p className="text-xs text-green-600 mt-1">↑ 15% confidence</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Best Day to Promote</p>
                  <p className="text-2xl font-bold text-purple-600">Friday</p>
                  <p className="text-xs text-gray-600 mt-1">Based on patterns</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Recommended Stock</p>
                  <p className="text-2xl font-bold text-purple-600">+25%</p>
                  <p className="text-xs text-gray-600 mt-1">For top products</p>
                </div>
              </div>
            </div>

            {/* Customer Segmentation */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Customer Segmentation
                </h3>
                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                  PREMIUM
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">VIP Customers</p>
                  <p className="text-3xl font-bold text-blue-600">87</p>
                  <p className="text-xs text-gray-600 mt-1">$5M+ lifetime value</p>
                </div>
                <div className="p-4 border-2 border-green-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Regular</p>
                  <p className="text-3xl font-bold text-green-600">456</p>
                  <p className="text-xs text-gray-600 mt-1">Monthly purchases</p>
                </div>
                <div className="p-4 border-2 border-yellow-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Occasional</p>
                  <p className="text-3xl font-bold text-yellow-600">523</p>
                  <p className="text-xs text-gray-600 mt-1">Quarterly visits</p>
                </div>
                <div className="p-4 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">At Risk</p>
                  <p className="text-3xl font-bold text-red-600">181</p>
                  <p className="text-xs text-gray-600 mt-1">No activity 60+ days</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
