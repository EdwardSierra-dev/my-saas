"use client";

import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  type: "product" | "service";
  cost?: number;
  stock?: number;
  image?: string;
  minStockAlert?: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Corte de Cabello Clásico",
    price: 25000,
    type: "service",
    cost: 8000,
  },
  {
    id: 2,
    name: "Shampoo Profesional 500ml",
    price: 45000,
    type: "product",
    cost: 30000,
    stock: 15,
    minStockAlert: 5,
  },
  {
    id: 3,
    name: "Tinte para Cabello",
    price: 80000,
    type: "product",
    cost: 50000,
    stock: 3,
    minStockAlert: 5,
  },
  {
    id: 4,
    name: "Manicure Completo",
    price: 35000,
    type: "service",
    cost: 12000,
  },
];

export default function InventoryModule() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    minStockAlert: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    type: "product" as "product" | "service",
    cost: "",
    stock: "",
    enableMinStock: false,
    minStockAlert: "",
  });

  const lowStockProducts = products.filter(
    (p) => p.minStockAlert && p.stock !== undefined && p.stock <= p.minStockAlert
  );

  const calculateRecommendedPrice = (cost: number) => {
    const margin20 = cost * 1.2;
    const margin35 = cost * 1.35;
    return { min: Math.round(margin20), max: Math.round(margin35) };
  };

  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: products.length + 1,
      name: formData.name,
      price: Number(formData.price), // Use Number() for precise conversion
      type: formData.type,
      cost: formData.cost ? Number(formData.cost) : undefined,
      stock: formData.stock ? parseInt(formData.stock, 10) : undefined,
      minStockAlert: formData.enableMinStock && formData.minStockAlert
        ? parseInt(formData.minStockAlert, 10)
        : undefined,
    };

    setProducts([...products, newProduct]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleUpdateProduct = () => {
    if (!selectedProduct) return;

    const updatedProduct: Product = {
      ...selectedProduct,
      name: editData.name,
      price: Number(editData.price),
      cost: editData.cost ? Number(editData.cost) : undefined,
      stock: editData.stock ? parseInt(editData.stock, 10) : undefined,
      minStockAlert: editData.minStockAlert
        ? parseInt(editData.minStockAlert, 10)
        : undefined,
    };

    setProducts(
      products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
    );
    setSelectedProduct(updatedProduct);
    setIsEditMode(false);
  };

  const startEditMode = (product: Product) => {
    setEditData({
      name: product.name,
      price: product.price.toString(),
      cost: product.cost?.toString() || "",
      stock: product.stock?.toString() || "",
      minStockAlert: product.minStockAlert?.toString() || "",
    });
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditData({
      name: "",
      price: "",
      cost: "",
      stock: "",
      minStockAlert: "",
    });
  };

  const handleDeleteProduct = () => {
    if (deleteConfirmText.toLowerCase() === "delete" && selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setShowDeleteModal(false);
      setDeleteConfirmText("");
      setSelectedProduct(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      type: "product",
      cost: "",
      stock: "",
      enableMinStock: false,
      minStockAlert: "",
    });
  };

  const openDetailModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditMode(false);
    setShowDetailModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-gray-50">
      <div className="h-full max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Products / Services
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create
          </button>
        </div>

        {/* Low Stock Alert Banner */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-yellow-700">
                    {lowStockProducts.length} product(s) running low on stock
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLowStockModal(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => openDetailModal(product)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        ${product.price.toLocaleString()} COP
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.type === "product"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {product.type === "product" ? "Product" : "Service"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {product.cost
                          ? `$${product.cost.toLocaleString()} COP`
                          : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stock !== undefined ? (
                        <span
                          className={`text-sm font-medium ${
                            product.minStockAlert &&
                            product.stock <= product.minStockAlert
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {product.stock}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(product);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-gray-500">No products or services yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 btn-primary"
              >
                Create Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Product / Service Creation Form
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateProduct();
              }}
              className="space-y-6"
            >
              {/* Name - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter product or service name"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="product"
                      checked={formData.type === "product"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "product" | "service",
                        })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="service"
                      checked={formData.type === "service"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "product" | "service",
                        })
                      }
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-gray-700">Service</span>
                  </label>
                </div>
              </div>

              {/* Cost - Optional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost (Optional)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter cost"
                />
                {formData.cost && parseFloat(formData.cost) > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Recommended Price:</strong>{" "}
                      ${calculateRecommendedPrice(parseFloat(formData.cost)).min.toLocaleString()} - $
                      {calculateRecommendedPrice(parseFloat(formData.cost)).max.toLocaleString()} COP
                      <span className="text-xs block mt-1">
                        (20-35% profit margin)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Price - Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter selling price"
                />
              </div>

              {/* Stock - Optional (only for products) */}
              {formData.type === "product" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity / Stock (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter initial stock"
                  />
                </div>
              )}

              {/* Minimum Stock Alert */}
              {formData.type === "product" && formData.stock && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.enableMinStock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          enableMinStock: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable minimum stock alert
                    </span>
                  </label>

                  {formData.enableMinStock && (
                    <input
                      type="number"
                      value={formData.minStockAlert}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minStockAlert: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter minimum stock threshold"
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {isEditMode ? "Edit Product" : "Product Details"}
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProduct(null);
                  setIsEditMode(false);
                }}
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

            {!isEditMode ? (
              /* View Mode */
              <div className="space-y-4">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  {selectedProduct.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-gray-500 mt-2">No image uploaded</p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedProduct.type === "product"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {selectedProduct.type === "product" ? "Product" : "Service"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">
                      ${selectedProduct.price.toLocaleString()} COP
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost</p>
                    <p className="font-semibold text-gray-900">
                      {selectedProduct.cost
                        ? `$${selectedProduct.cost.toLocaleString()} COP`
                        : "N/A"}
                    </p>
                  </div>
                  {selectedProduct.stock !== undefined && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Current Stock</p>
                        <p
                          className={`font-semibold ${
                            selectedProduct.minStockAlert &&
                            selectedProduct.stock <= selectedProduct.minStockAlert
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {selectedProduct.stock}
                        </p>
                      </div>
                      {selectedProduct.minStockAlert && (
                        <div>
                          <p className="text-sm text-gray-500">Min Stock Alert</p>
                          <p className="font-semibold text-gray-900">
                            {selectedProduct.minStockAlert}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Profit Margin */}
                {selectedProduct.cost && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Profit Margin
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      $
                      {(selectedProduct.price - selectedProduct.cost).toLocaleString()}{" "}
                      COP
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      {(
                        ((selectedProduct.price - selectedProduct.cost) /
                          selectedProduct.cost) *
                        100
                      ).toFixed(1)}
                      % margin
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => startEditMode(selectedProduct)}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateProduct();
                }}
                className="space-y-4"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    step="1"
                    min="0"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editData.cost}
                    onChange={(e) =>
                      setEditData({ ...editData, cost: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {editData.cost && Number(editData.cost) > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Recommended Price:</strong>{" "}
                        ${calculateRecommendedPrice(Number(editData.cost)).min.toLocaleString()} - $
                        {calculateRecommendedPrice(Number(editData.cost)).max.toLocaleString()} COP
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock (only for products) */}
                {selectedProduct.type === "product" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={editData.stock}
                        onChange={(e) =>
                          setEditData({ ...editData, stock: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock Alert
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={editData.minStockAlert}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            minStockAlert: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete{" "}
                <strong>{selectedProduct.name}</strong>? This action cannot be
                undone.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <strong>&quot;delete&quot;</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="delete"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                  setSelectedProduct(null);
                }}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleteConfirmText.toLowerCase() !== "delete"}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Alert Modal */}
      {showLowStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Low Stock Products
                </h3>
              </div>
              <button
                onClick={() => setShowLowStockModal(false)}
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

            <div className="space-y-3 mb-6">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Current Stock:{" "}
                        <span className="font-semibold text-red-600">
                          {product.stock}
                        </span>{" "}
                        / Minimum:{" "}
                        <span className="font-semibold">
                          {product.minStockAlert}
                        </span>
                      </p>
                    </div>
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowLowStockModal(false)}
              className="w-full btn-primary py-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
