"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo y título */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenido
          </h1>
          <p className="text-gray-600">
            Selecciona cómo deseas continuar
          </p>
        </div>

        {/* Botones principales */}
        <div className="space-y-4">
          <Link
            href="/auth/business"
            className="block w-full bg-primary-600 text-white py-4 px-6 rounded-xl text-center font-semibold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Negocio / Tienda
          </Link>

          <Link
            href="/customer/register"
            className="block w-full bg-white text-gray-900 py-4 px-6 rounded-xl text-center font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-2 border-gray-200"
          >
            Cliente
          </Link>
        </div>

        {/* Link de login */}
        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ¿Ya tienes una cuenta?
          </Link>
        </div>

        {/* Logo y desarrollador */}
        <div className="pt-12 text-center space-y-2">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-primary-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Desarrollado por <span className="font-semibold">eJSc</span>
          </p>
        </div>
      </div>
    </div>
  );
}
