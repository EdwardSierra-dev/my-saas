"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  is_service: boolean;
  is_active: boolean;
}

interface Business {
  id: number;
  name: string;
  business_type: string;
  city: string;
  department: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

export default function BusinessDetail() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cashPayment, setCashPayment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");

    if (!token || userRole !== "customer") {
      router.push("/customer/login");
      return;
    }

    loadBusinessDetails();
    checkFavoriteStatus();
  }, [businessId, router]);

  const loadBusinessDetails = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Load business info
      const businessResponse = await fetch(
        `http://localhost:8000/api/v1/businesses/${businessId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (businessResponse.ok) {
        const businessData = await businessResponse.json();
        setBusiness(businessData);
      }

      // Load products (mock for now - will be replaced with real API)
      // In production, this would call the business's inventory API
      setProducts([
        {
          id: 1,
          name: "Haircut",
          description: "Professional haircut service",
          price: 2500,
          stock_quantity: 999,
          is_service: true,
          is_active: true,
        },
        {
          id: 2,
          name: "Hair Coloring",
          description: "Full hair coloring service",
          price: 5000,
          stock_quantity: 999,
          is_service: true,
          is_active: true,
        },
      ]);
    } catch (error) {
      console.error("Error loading business details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://localhost:8000/api/v1/customers/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const favorites = await response.json();
        const isFav = favorites.some((fav: any) => fav.business_id === parseInt(businessId));
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem("access_token");

    try {
      if (isFavorite) {
        // Remove from favorites
        const favoritesResponse = await fetch(
          `http://localhost:8000/api/v1/customers/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (favoritesResponse.ok) {
          const favorites = await favoritesResponse.json();
          const favoriteItem = favorites.find(
            (fav: any) => fav.business_id === parseInt(businessId)
          );

          if (favoriteItem) {
            await fetch(`http://localhost:8000/api/v1/customers/favorites/${favoriteItem.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setIsFavorite(false);
          }
        }
      } else {
        // Add to favorites
        const response = await fetch(`http://localhost:8000/api/v1/customers/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ business_id: parseInt(businessId) }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else if (response.status === 400) {
          alert("Maximum 10 favorites allowed");
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const addToOrder = (product: Product) => {
    const existing = orderItems.find((item) => item.product.id === product.id);

    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (orderItems.length >= 20) {
        alert("Maximum 20 items per order");
        return;
      }
      setOrderItems([...orderItems, { product, quantity: 1 }]);
    }
  };

  const removeFromOrder = (productId: number) => {
    setOrderItems(orderItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromOrder(productId);
      return;
    }

    setOrderItems(
      orderItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount / 100);
  };

  const handlePlaceOrder = () => {
    if (orderItems.length === 0) {
      alert("Please add items to your order");
      return;
    }
    setShowCheckout(true);
  };

  const handleCompletePurchase = async () => {
    if (!paymentMethod && !cashPayment) {
      alert("Please select a payment method");
      return;
    }

    // In production, this would create an actual order
    alert(
      `Order placed successfully!\nTotal: ${formatCurrency(calculateTotal())}\nPayment: ${
        cashPayment ? "Cash on delivery" : paymentMethod
      }`
    );

    // Reset order
    setOrderItems([]);
    setShowOrderModal(false);
    setShowCheckout(false);
    setPaymentMethod("");
    setCashPayment(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
          <Link
            href="/customer/search"
            className="text-primary-600 hover:text-primary-700"
          >
            ← Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/customer/search"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Search</span>
            </Link>

            <button
              onClick={toggleFavorite}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className={`w-6 h-6 transition-colors ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "fill-none text-gray-400 hover:text-red-500"
                }`}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Business Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-4xl">
              {business.logo_url ? (
                <img
                  src={business.logo_url}
                  alt={business.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                "🏢"
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{business.name}</h1>
              <p className="text-lg text-gray-600 capitalize mb-4">
                {business.business_type.replace("_", " ")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <span>
                    {business.city}, {business.department}
                  </span>
                </div>

                {business.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{business.phone}</span>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{business.email}</span>
                  </div>
                )}

                {business.address && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowOrderModal(true)}
              className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Products/Services List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Products & Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  </div>
                  {product.is_service && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Service
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </span>
                  <button
                    onClick={() => {
                      addToOrder(product);
                      setShowOrderModal(true);
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && !showCheckout && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowOrderModal(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Order</h2>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {orderItems.length}/20 items • {formatCurrency(calculateTotal())}
                </p>
              </div>

              <div className="p-6">
                {orderItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-gray-600">Your order is empty</p>
                    <p className="text-sm text-gray-500 mt-2">Add products or services to continue</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">{formatCurrency(item.product.price)}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromOrder(item.product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {orderItems.length > 0 && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Complete Purchase
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCheckout(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    {orderItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setCashPayment(false);
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="flex-1 font-medium">Credit/Debit Card</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={cashPayment}
                        onChange={(e) => {
                          setCashPayment(e.target.checked);
                          if (e.target.checked) setPaymentMethod("");
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <div className="flex-1">
                        <span className="font-medium block">Cash on Delivery/Service</span>
                        <span className="text-sm text-gray-600">
                          Pay in person after receiving the service or delivery
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Complete Purchase Button */}
                <button
                  onClick={handleCompletePurchase}
                  disabled={!paymentMethod && !cashPayment}
                  className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Purchase
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
