"use client";

interface ModuleCardProps {
  name: string;
  price: number;
  isSelected: boolean;
  onToggle: () => void;
  showTooltip?: boolean;
  tooltipContent?: string;
}

export default function ModuleCard({
  name,
  price,
  isSelected,
  onToggle,
  showTooltip = false,
  tooltipContent,
}: ModuleCardProps) {
  return (
    <div className="relative">
      <label
        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
          isSelected
            ? "border-primary-600 bg-primary-50"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
          />
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-primary-600">${price}</p>
          <p className="text-xs text-gray-500">USD/month</p>
        </div>
      </label>

      {/* Tooltip */}
      {showTooltip && isSelected && tooltipContent && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-slide-down">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
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
            <p className="text-sm text-blue-800 leading-relaxed">
              {tooltipContent}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
