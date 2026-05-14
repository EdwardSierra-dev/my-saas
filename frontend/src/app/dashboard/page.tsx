"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    // En producción, aquí harías una llamada al API para obtener el usuario
    // Por ahora, mostramos un dashboard simple
    setUser({ name: "Usuario de Prueba" });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            ¡Bienvenido! 🎉
          </h2>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada exitosamente. Este es tu dashboard.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">
                Perfil
              </h3>
              <p className="text-sm text-primary-700">
                Gestiona tu información de negocio
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Inventario
              </h3>
              <p className="text-sm text-green-700">
                Administra tus productos
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Órdenes
              </h3>
              <p className="text-sm text-blue-700">
                Gestiona tus pedidos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
