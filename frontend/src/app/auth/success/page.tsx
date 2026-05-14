"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(true);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleClose = () => {
    if (canClose) {
      router.push("/dashboard");
    }
  };

  return (
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
          Tu cuenta ha sido creada exitosamente. Serás redirigido al dashboard en:
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
            <span className="text-3xl font-bold text-primary-600">
              {countdown}
            </span>
          </div>
        </div>

        {/* Botón de cierre manual */}
        <button
          onClick={handleClose}
          disabled={!canClose}
          className="btn-primary w-full"
        >
          Ir al Dashboard Ahora
        </button>

        {/* Animación de confetti (opcional) */}
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
  );
}
