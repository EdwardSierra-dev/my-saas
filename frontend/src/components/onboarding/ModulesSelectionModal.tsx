"use client";

import { useState } from "react";
import ModuleCard from "./ModuleCard";

interface Module {
  id: string;
  name: string;
  price: number;
  tooltip?: string;
}

interface ModulesSelectionModalProps {
  onComplete: (selectedModules: string[]) => void;
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
  { id: "analytics", name: "Analytics Module", price: 7 },
  { id: "scheduling", name: "Scheduling Module", price: 5 },
  { id: "reviews", name: "Reviews & Ratings Module", price: 3 },
];

export default function ModulesSelectionModal({
  onComplete,
  onBack,
}: ModulesSelectionModalProps) {
  const [selectedModules, setSelectedModules] = useState<Set<string>>(new Set());

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
    return availableModules
      .filter((module) => selectedModules.has(module.id))
      .reduce((sum, module) => sum + module.price, 0);
  };

  const handleContinue = () => {
    if (selectedModules.size > 0) {
      onComplete(Array.from(selectedModules));
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
            <ModuleCard
              key={module.id}
              name={module.name}
              price={module.price}
              isSelected={selectedModules.has(module.id)}
              onToggle={() => toggleModule(module.id)}
              showTooltip={!!module.tooltip}
              tooltipContent={module.tooltip}
            />
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
