"use client";

import { useState } from "react";
import ModuleCard from "./ModuleCard";

interface Module {
  id: string;
  name: string;
  price: number;
  tooltip?: string;
  hasSubOptions?: boolean;
}

interface ModulesSelectionModalProps {
  onComplete: (selectedModules: string[], analyticsTier?: string) => void;
  onBack: () => void;
}

const availableModules: Module[] = [
  {
    id: "chat",
    name: "Chat Module",
    price: 5,
    tooltip:
      "The privacy of your personal information is what matters most to us. Chat with your customers without sharing your personal phone number.",
  },
  { id: "delivery", name: "Delivery Module", price: 6 },
  { id: "inventory", name: "Inventory Module", price: 6 },
  { id: "promotions", name: "Promotions Module", price: 4 },
  { id: "recommendation", name: "Recommendation Module", price: 5 },
  {
    id: "analytics",
    name: "Analytics Module",
    price: 0, // Base price, will be determined by tier selection
    hasSubOptions: true,
  },
  { id: "scheduling", name: "Scheduling Module", price: 5 },
  { id: "reviews", name: "Reviews & Ratings Module", price: 3 },
];

export default function ModulesSelectionModal({
  onComplete,
  onBack,
}: ModulesSelectionModalProps) {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());
  const [analyticsTier, setAnalyticsTier] = useState<string | null>(null);

  const analyticsTiers = [
    {
      id: "analytics-basic",
      name: "Basic Analytics",
      price: 7,
      description: "Essential metrics for daily operations",
      features: [
        "Total Revenue & Orders",
        "Top 10 Products/Services",
        "Active Customers Count",
        "Basic Sales Trends",
      ],
    },
    {
      id: "analytics-advanced",
      name: "Advanced Analytics",
      price: 12,
      description: "Includes Basic + intermediate analysis",
      features: [
        "Everything in Basic",
        "Customer Retention & CLV",
        "Inventory Performance",
        "Delivery Metrics",
        "Period Comparisons",
        "Profit Margin Analysis",
      ],
    },
    {
      id: "analytics-premium",
      name: "Premium Analytics",
      price: 18,
      description: "Includes Advanced + ML predictions",
      features: [
        "Everything in Advanced",
        "AI Sales Predictions",
        "Customer Segmentation",
        "Cohort Analysis",
        "Automated Recommendations",
        "Custom Reports & Exports",
      ],
    },
  ];

  const toggleModule = (moduleId: string) => {
    setSelectedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const calculateTotal = () => {
    let total = availableModules
      .filter((module) => selectedModules.has(module.id) && module.id !== "analytics")
      .reduce((sum, module) => sum + module.price, 0);

    // Add analytics tier price if selected
    if (selectedModules.has("analytics") && analyticsTier) {
      const tier = analyticsTiers.find((t) => t.id === analyticsTier);
      if (tier) {
        total += tier.price;
      }
    }

    return total;
  };

  const handleContinue = () => {
    if (selectedModules.size > 0) {
      // If analytics is selected but no tier chosen, don't proceed
      if (selectedModules.has("analytics") && !analyticsTier) {
        alert("Please select an Analytics tier");
        return;
      }
      onComplete(Array.from(selectedModules), analyticsTier || undefined);
    }
  };

  const totalPrice = calculateTotal();
  const hasSelection = selectedModules.size > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full my-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select Your Business Modules
          </h2>
          <p className="text-gray-600">
            Choose the modules that best fit your business needs
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
          {availableModules.map((module) => (
            <div key={module.id}>
              <ModuleCard
                name={module.name}
                price={module.price}
                isSelected={selectedModules.has(module.id)}
                onToggle={() => toggleModule(module.id)}
                showTooltip={!!module.tooltip}
                tooltipContent={module.tooltip}
              />

              {/* Analytics Tiers - Show when Analytics is selected */}
              {module.id === "analytics" && selectedModules.has("analytics") && (
                <div className="ml-8 mt-3 space-y-2 border-l-2 border-primary-200 pl-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Select Analytics Tier:
                  </p>
                  {analyticsTiers.map((tier) => (
                    <label
                      key={tier.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        analyticsTier === tier.id
                          ? "border-primary-600 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="analytics-tier"
                          checked={analyticsTier === tier.id}
                          onChange={() => setAnalyticsTier(tier.id)}
                          className="mt-1 w-4 h-4 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {tier.name}
                            </h4>
                            <span className="font-bold text-primary-600">
                              ${tier.price}/month
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {tier.description}
                          </p>
                          <ul className="space-y-1">
                            {tier.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-gray-700 flex items-start gap-2"
                              >
                                <svg
                                  className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> The Subscription/Billing Module is included by
              default for all business accounts.
            </p>
          </div>
        </div>

        {/* Total Price */}
        <div className="mb-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Total Monthly Cost</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedModules.size} module{selectedModules.size !== 1 ? "s" : ""}{" "}
                selected
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                ${totalPrice}
              </p>
              <p className="text-sm text-gray-600">USD/month</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!hasSelection}
            className={`flex-1 px-6 py-3 font-semibold rounded-xl transition-all ${
              hasSelection
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
