"""Application enums and constants."""

from enum import Enum


class UserRole(str, Enum):
    """User roles in the system."""
    
    SUPER_ADMIN = "super_admin"
    BUSINESS_OWNER = "business_owner"
    BUSINESS_STAFF = "business_staff"
    CUSTOMER = "customer"


class BusinessType(str, Enum):
    """Types of businesses supported."""
    
    BARBERSHOP = "barbershop"
    SPA = "spa"
    LOCAL_STORE = "local_store"
    RESTAURANT = "restaurant"
    PHARMACY = "pharmacy"
    INDEPENDENT_WORKER = "independent_worker"
    OTHER = "other"


class OAuthProvider(str, Enum):
    """Supported OAuth providers."""
    
    GOOGLE = "google"
    MICROSOFT = "microsoft"
    LINKEDIN = "linkedin"


class ColombiaDepartment(str, Enum):
    """Colombian departments."""
    
    AMAZONAS = "Amazonas"
    ANTIOQUIA = "Antioquia"
    ARAUCA = "Arauca"
    ATLANTICO = "Atlántico"
    BOLIVAR = "Bolívar"
    BOYACA = "Boyacá"
    CALDAS = "Caldas"
    CAQUETA = "Caquetá"
    CASANARE = "Casanare"
    CAUCA = "Cauca"
    CESAR = "Cesar"
    CHOCO = "Chocó"
    CORDOBA = "Córdoba"
    CUNDINAMARCA = "Cundinamarca"
    GUAINIA = "Guainía"
    GUAVIARE = "Guaviare"
    HUILA = "Huila"
    LA_GUAJIRA = "La Guajira"
    MAGDALENA = "Magdalena"
    META = "Meta"
    NARINO = "Nariño"
    NORTE_DE_SANTANDER = "Norte de Santander"
    PUTUMAYO = "Putumayo"
    QUINDIO = "Quindío"
    RISARALDA = "Risaralda"
    SAN_ANDRES = "San Andrés y Providencia"
    SANTANDER = "Santander"
    SUCRE = "Sucre"
    TOLIMA = "Tolima"
    VALLE_DEL_CAUCA = "Valle del Cauca"
    VAUPES = "Vaupés"
    VICHADA = "Vichada"
