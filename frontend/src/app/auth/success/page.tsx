"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IntroCarouselModal from "@/components/onboarding/IntroCarouselModal";
import ModulesSelectionModal from "@/components/onboarding/ModulesSelectionModal";
import ConfirmationModal from "@/components/onboarding/ConfirmationModal";

type OnboardingStep = "success" | "intro" | "modules" | "confirmation";

export default function RegistrationSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("success");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [analyticsTier, setAnalyticsTier] = useState<string | undefined>();

  useEffect(() => {
    if (currentStep === "success") {
      // Countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCurrentStep("intro");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const handleContinueToOnboarding = () => {
    setCurrentStep("intro");
  };

  const handleIntroComplete = () => {
    setCurrentStep("modules");
  };

  const handleModulesBack = () => {
    setCurrentStep("intro");
  };

  const handleModulesComplete = (modules: string[], tier?: string) => {
    setSelectedModules(modules);
    setAnalyticsTier(tier);
    
    // Calculate total price
    const modulePrices: Record<string, number> = {
      chat: 5,
      delivery: 6,
      inventory: 6,
      promotions: 4,
      recommendation: 5,
      analytics: 0, // Will be added from tier
      scheduling: 5,
      reviews: 3,
    };

    const analyticsTierPrices: Record<string, number> = {
      "analytics-basic": 7,
      "analytics-advanced": 12,
      "analytics-premium": 18,
    };
    
    let total = modules.reduce((sum, moduleId) => {
      if (moduleId === "analytics") return sum;
      return sum + (modulePrices[moduleId] || 0);
    }, 0);

    // Add analytics tier price if selected
    if (modules.includes("analytics") && tier) {
      total += analyticsTierPrices[tier] || 0;
    }
    
    setTotalPrice(total);
    
    setCurrentStep("confirmation");
  };

  return (
    <>
      {/* Success Modal */}
      {currentStep === "success" && (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
            {/* Icono de éxito */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
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
            </div>

            {/* Mensaje */}
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ¡Registro Completado!
            </h2>
            <p className="text-gray-600 mb-8">
              Tu cuenta ha sido creada exitosamente. Configuremos tu plataforma en:
            </p>

            {/* Countdown */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
                <span className="text-3xl font-bold text-primary-600">
                  {countdown}
                </span>
              </div>
            </div>

            {/* Botón de continuar manual */}
            <button
              onClick={handleContinueToOnboarding}
              className="btn-primary w-full"
            >
              Continuar Ahora
            </button>

            {/* Animación de confetti */}
            <div className="mt-6 text-4xl animate-bounce">
              🎉
            </div>
          </div>

          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: scale(0.9);
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
      )}

      {/* Intro Carousel Modal */}
      {currentStep === "intro" && (
        <IntroCarouselModal onComplete={handleIntroComplete} />
      )}

      {/* Modules Selection Modal */}
      {currentStep === "modules" && (
        <ModulesSelectionModal
          onComplete={handleModulesComplete}
          onBack={handleModulesBack}
        />
      )}

      {/* Confirmation Modal */}
      {currentStep === "confirmation" && (
        <ConfirmationModal
          selectedModules={selectedModules}
          totalPrice={totalPrice}
          analyticsTier={analyticsTier}
        />
      )}
    </>
  );
}
