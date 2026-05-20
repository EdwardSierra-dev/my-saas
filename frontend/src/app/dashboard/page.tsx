"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OperationsLayout from "@/components/operations/OperationsLayout";
import ChatModule from "@/components/operations/modules/ChatModule";
import DeliveryModule from "@/components/operations/modules/DeliveryModule";

// Module icons
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const DeliveryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const InventoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeModule, setActiveModule] = useState("chat");

  // TODO: Get enabled modules from user's subscription
  const enabledModules = [
    { id: "chat", name: "Chat", icon: <ChatIcon /> },
    { id: "delivery", name: "Delivery", icon: <DeliveryIcon /> },
    { id: "inventory", name: "Inventory", icon: <InventoryIcon /> },
    { id: "analytics", name: "Analytics", icon: <AnalyticsIcon /> },
  ];

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    // En producción, aquí harías una llamada al API para obtener el usuario
    setUser({ name: "Usuario de Prueba" });
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case "chat":
        return <ChatModule />;
      case "delivery":
        return <DeliveryModule />;
      case "inventory":
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <InventoryIcon />
              <p className="mt-4">Inventory Module - Coming Soon</p>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <AnalyticsIcon />
              <p className="mt-4">Analytics Module - Coming Soon</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <OperationsLayout
      enabledModules={enabledModules}
      activeModule={activeModule}
      onModuleChange={setActiveModule}
    >
      {renderModule()}
    </OperationsLayout>
  );
}
