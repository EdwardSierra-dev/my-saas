"use client";

import { useState } from "react";

interface DeliveryOrder {
  id: number;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  address: string;
  serviceType: string;
  summary: string;
  status: "received" | "in_progress" | "delivered" | "returned";
  receptionDate: string;
  receptionTime: string;
}

interface OrderDetail {
  orderId: number;
  items?: Array<{
    name: string;
    quantity: number;
    notes?: string;
  }>;
  serviceDescription?: string;
  totalAmount?: number;
  additionalNotes?: string;
}

const mockOrders: DeliveryOrder[] = [
  {
    id: 1001,
    customerId: "c1",
    customerName: "María García",
    address: "Calle 45 #23-10, Barranquilla",
    serviceType: "Restaurant Delivery",
    summary: "2x Hamburguesa, 1x Papas Fritas, 2x Coca-Cola",
    status: "in_progress",
    receptionDate: "2026-05-19",
    receptionTime: "14:30",
  },
  {
    id: 1002,
    customerId: "c2",
    customerName: "Carlos Rodríguez",
    address: "Carrera 52 #78-45, Barranquilla",
    serviceType: "Pharmacy Delivery",
    summary: "Medicamentos recetados + Vitaminas",
    status: "received",
    receptionDate: "2026-05-19",
    receptionTime: "13:15",
  },
  {
    id: 1003,
    customerId: "c3",
    customerName: "Ana Martínez",
    address: "Avenida Murillo #12-34, Barranquilla",
    serviceType: "Haircut Service",
    summary: "Corte de cabello + Peinado",
    status: "delivered",
    receptionDate: "2026-05-19",
    receptionTime: "10:00",
  },
  {
    id: 1004,
    customerId: "c4",
    customerName: "Luis Pérez",
    address: "Calle 84 #50-23, Barranquilla",
    serviceType: "Local Store",
    summary: "Productos de limpieza",
    status: "returned",
    receptionDate: "2026-05-18",
    receptionTime: "16:45",
  },
];

const mockOrderDetails: Record<number, OrderDetail> = {
  1001: {
    orderId: 1001,
    items: [
      { name: "Hamburguesa Especial", quantity: 2, notes: "Sin cebolla" },
      { name: "Papas Fritas Grande", quantity: 1 },
      { name: "Coca-Cola 500ml", quantity: 2 },
    ],
    totalAmount: 45000,
    additionalNotes: "Entregar en la puerta principal",
  },
  1003: {
    orderId: 1003,
    serviceDescription:
      "Servicio de corte de cabello estilo moderno con peinado incluido. Cliente solicitó un fade bajo con textura en la parte superior.",
    totalAmount: 35000,
    additionalNotes: "Cliente regular, prefiere estilista Juan",
  },
};

export default function DeliveryModule() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredOrders =
    filterStatus === "all"
      ? mockOrders
      : mockOrders.filter((order) => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "received":
        return "Received";
      case "in_progress":
        return "In Progress";
      case "delivered":
        return "Delivered";
      case "returned":
        return "Returned";
      default:
        return status;
    }
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    // TODO: Update status in backend
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const orderDetail = selectedOrder ? mockOrderDetails[selectedOrder] : null;

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50">
      <div className="h-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Delivery & Services
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilterStatus("received")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "received"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setFilterStatus("in_progress")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "in_progress"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus("delivered")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "delivered"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Delivered
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reception
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        #{order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {order.customerName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{order.address}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {order.serviceType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="text-sm text-primary-600 hover:text-primary-800 hover:underline"
                      >
                        {order.summary}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.receptionDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.receptionTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="received">Received</option>
                        <option value="in_progress">In Progress</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && orderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Order #{orderDetail.orderId}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Order Items */}
            {orderDetail.items && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items:</h4>
                <div className="space-y-2">
                  {orderDetail.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-700 font-semibold">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Description */}
            {orderDetail.serviceDescription && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Service Description:
                </h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {orderDetail.serviceDescription}
                </p>
              </div>
            )}

            {/* Additional Notes */}
            {orderDetail.additionalNotes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Additional Notes:
                </h4>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  {orderDetail.additionalNotes}
                </p>
              </div>
            )}

            {/* Total Amount */}
            {orderDetail.totalAmount && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${orderDetail.totalAmount.toLocaleString()} COP
                  </span>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 btn-primary py-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
