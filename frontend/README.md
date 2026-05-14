# Frontend - Modular SaaS Platform

Frontend web con Next.js 14, TypeScript y TailwindCSS.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Levantar servidor de desarrollo
npm run dev
```

Abre http://localhost:3000

## 📁 Estructura

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página inicial (Business/Customer)
│   ├── auth/
│   │   ├── business/      # Flujo de registro de negocio
│   │   └── success/       # Modal de éxito
│   └── dashboard/         # Dashboard principal
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y API client
├── types/                 # TypeScript types
└── styles/               # Estilos globales
```

## 🎨 Páginas Implementadas

### ✅ Página Inicial (`/`)
- Botones Business / Customer
- Link "¿Ya tienes cuenta?"
- Logo y desarrollador

### ✅ Autenticación Business (`/auth/business`)
- Botones OAuth (Google, Microsoft, LinkedIn)
- Diseño vertical
- Loading states

### ✅ Registro Business (`/auth/business/register`)
- Formulario completo con validaciones
- Campos requeridos y opcionales
- Validación en tiempo real
- Integración con backend

### ✅ Éxito (`/auth/success`)
- Modal de confirmación
- Countdown de 5 segundos
- Botón de cierre manual

### ✅ Dashboard (`/dashboard`)
- Vista básica post-registro
- Logout

## 🔧 Validaciones Implementadas

- **Nombre**: Mínimo 2 caracteres
- **Teléfono**: Exactamente 10 dígitos
- **Contraseña**: 8+ caracteres, mayúscula, minúscula, número, especial
- **Departamento**: 32 departamentos colombianos
- **Business Type**: 6 tipos predefinidos

## 🌐 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Modular SaaS
```

## 📦 Scripts

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run start    # Servidor producción
npm run lint     # Linter
```

## 🎯 Próximos Pasos

1. Implementar OAuth real con backend
2. Agregar más páginas del dashboard
3. Implementar módulos adicionales
4. Agregar tests

---

**Status**: ✅ Funcional
**Version**: 1.0.0
