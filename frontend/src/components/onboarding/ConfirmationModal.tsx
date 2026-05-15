"use client";

import { useRouter } from "next/navigation";

interface ConfirmationModalProps {
  selectedModules: string[];
  totalPrice: number;
}

const moduleNames: Record<string, string> = {
  chat: "Chat Module",
  delivery: "Delivery Module",
  inventory: "Inventory Module",
  promotions: "Promotions Module",
  recommendation: "Recommendation Module",
  analytics: "Analytics Module",
  scheduling: "Scheduling Module",
  reviews: "Reviews & Ratings Module",
};

export default function ConfirmationModal({
  selectedModules,
  totalPrice,
}: ConfirmationModalProps) {
  const router = useRouter();

  const handleConfirm = () => {
    // TODO: Save configuration to backend
    router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fade-in">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-green-600"
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
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Configuration Complete!
          </h2>
        </div>

        {/* Selected Modules Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Selected Modules:</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {selectedModules.map((moduleId) => (
              <div
                key={moduleId}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <svg
                  className="w-5 h-5 text-primary-600"
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
                <span className="text-gray-700">{moduleNames[moduleId]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price */}
        <div className="mb-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-gray-900">Total Monthly Cost:</p>
            <p className="text-2xl font-bold text-primary-600">
              ${totalPrice} USD
            </p>
          </div>
        </div>

        {/* Trial Information */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                15-Day Free Trial
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                You will have <strong>15 days of completely free trial access</strong>.
                After this period, the services will be temporarily unavailable and our
                team will contact you via email.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
        >
          Start Using Your Platform
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          You can modify your modules anytime from your dashboard settings
        </p>
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
