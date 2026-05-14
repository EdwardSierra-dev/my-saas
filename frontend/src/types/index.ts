export interface RegisterBusinessData {
  temp_token: string;
  name: string;
  business_type: string;
  city: string;
  department: string;
  phone: string;
  password: string;
  confirm_password: string;
  address?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  tenant_id?: number;
  created_at: string;
}

export interface Tenant {
  id: number;
  name: string;
  business_type: string;
  slug: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  department?: string;
  country: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterResponse {
  user: User;
  tenant: Tenant;
  tokens: Tokens;
}

export const BUSINESS_TYPES = [
  { value: "barbershop", label: "Barbería / Peluquería" },
  { value: "spa", label: "Spa" },
  { value: "local_store", label: "Tienda Local" },
  { value: "restaurant", label: "Restaurante" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "independent_worker", label: "Trabajador Independiente" },
];

export const COLOMBIAN_DEPARTMENTS = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar",
  "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
  "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía",
  "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta",
  "Nariño", "Norte de Santander", "Putumayo", "Quindío",
  "Risaralda", "San Andrés y Providencia", "Santander",
  "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"
];
