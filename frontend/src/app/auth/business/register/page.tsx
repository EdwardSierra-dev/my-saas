"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { BUSINESS_TYPES, COLOMBIAN_DEPARTMENTS } from "@/types";

export default function BusinessRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthData, setOauthData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    business_type: "",
    city: "",
    department: "",
    phone: "",
    password: "",
    confirm_password: "",
    address: "",
  });

  useEffect(() => {
    // Obtener datos de OAuth del sessionStorage
    const data = sessionStorage.getItem("oauth_data");
    if (!data) {
      router.push("/auth/business");
      return;
    }
    
    const parsed = JSON.parse(data);
    setOauthData(parsed);
    
    // Pre-llenar el nombre si viene de OAuth
    if (parsed.name) {
      setFormData(prev => ({ ...prev, name: parsed.name }));
    }
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.business_type) {
      newErrors.business_type = "Selecciona un tipo de negocio";
    }

    if (!formData.city) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!formData.department) {
      newErrors.department = "El departamento es requerido";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener exactamente 10 dígitos";
    }

    if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Debe contener al menos una mayúscula";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Debe contener al menos una minúscula";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Debe contener al menos un número";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Debe contener al menos un carácter especial";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!oauthData) return;

    setLoading(true);
    setErrors({});

    try {
      // Generar temp_token simulado (en producción viene del backend)
      const tempToken = btoa(JSON.stringify(oauthData));
      
      const response = await authAPI.registerBusiness({
        temp_token: tempToken,
        ...formData,
      });

      // Guardar tokens
      localStorage.setItem("access_token", response.tokens.access_token);
      localStorage.setItem("refresh_token", response.tokens.refresh_token);
      
      // Limpiar sessionStorage
      sessionStorage.removeItem("oauth_data");
      
      // Mostrar modal de éxito y redirigir
      router.push("/auth/success");
      
    } catch (error: any) {
      console.error("Error:", error);
      
      if (error.response?.data?.error?.details) {
        setErrors(error.response.data.error.details);
      } else {
        setErrors({
          general: error.response?.data?.error?.message || "Error al registrar el negocio"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (!oauthData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Completa tu Registro
          </h1>
          <p className="text-gray-600">
            Registrado con: <span className="font-semibold">{oauthData.email}</span>
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Nombre del Negocio */}
          <div>
            <label className="label">
              Nombre del Negocio <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
              placeholder="Ej: Barbería El Corte Perfecto"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Tipo de Negocio */}
          <div>
            <label className="label">
              Tipo de Negocio <span className="text-red-500">*</span>
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className={`input-field ${errors.business_type ? "border-red-500" : ""}`}
            >
              <option value="">Selecciona un tipo</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.business_type && <p className="text-red-500 text-sm mt-1">{errors.business_type}</p>}
          </div>

          {/* Ciudad y Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`input-field ${errors.city ? "border-red-500" : ""}`}
                placeholder="Ej: Bogotá"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="label">
                Departamento <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`input-field ${errors.department ? "border-red-500" : ""}`}
              >
                <option value="">Selecciona</option>
                {COLOMBIAN_DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="label">
              Teléfono (10 dígitos) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input-field ${errors.phone ? "border-red-500" : ""}`}
              placeholder="3001234567"
              maxLength={10}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Dirección (Opcional) */}
          <div>
            <label className="label">
              Dirección (Opcional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input-field"
              placeholder="Ej: Calle 123 #45-67"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recomendado para negocios con servicio presencial o domicilios
            </p>
          </div>

          {/* Contraseña */}
          <div>
            <label className="label">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? "border-red-500" : ""}`}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <p className="text-sm text-gray-500 mt-1">
              Debe contener: mayúscula, minúscula, número y carácter especial
            </p>
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="label">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`input-field ${errors.confirm_password ? "border-red-500" : ""}`}
              placeholder="Repite tu contraseña"
            />
            {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registrando...
              </span>
            ) : (
              "Completar Registro"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
