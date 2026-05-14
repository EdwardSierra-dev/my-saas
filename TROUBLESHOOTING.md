# Troubleshooting - Solución de Problemas

## Error 422 al Registrar Negocio

### Problema
Al intentar registrar un negocio, el backend devuelve un error 422 (Unprocessable Content).

### Causa
Error de validación en los datos enviados desde el frontend.

### Solución Aplicada
He actualizado los esquemas de Pydantic para ser compatibles con Pydantic v2 (compatible con Python 3.14).

### Cómo Verificar el Error

1. **Abre la consola del navegador** (F12 o clic derecho → Inspeccionar)
2. **Ve a la pestaña "Network" (Red)**
3. **Intenta registrar un negocio**
4. **Busca la petición a** `/api/v1/auth/register/business`
5. **Haz clic en ella y ve a "Response"**
6. **Copia el mensaje de error completo**

### Datos de Prueba Correctos

Usa exactamente estos datos:

```
Nombre del Negocio: Mi Barbería Test
Tipo de Negocio: barbershop (selecciona "Barbería / Peluquería")
Ciudad: Bogotá
Departamento: Cundinamarca
Teléfono: 3001234567
Dirección: Calle 123 #45-67 (opcional)
Contraseña: Test123!@#
Confirmar Contraseña: Test123!@#
```

### Validaciones Importantes

1. **Teléfono**: Debe ser exactamente 10 dígitos (sin espacios, guiones ni paréntesis)
2. **Tipo de Negocio**: Debe ser uno de estos valores exactos:
   - `barbershop`
   - `spa`
   - `local_store`
   - `restaurant`
   - `pharmacy`
   - `independent_worker`
3. **Contraseña**: Mínimo 8 caracteres con:
   - Al menos una mayúscula
   - Al menos una minúscula
   - Al menos un número
   - Al menos un carácter especial

### Ver Logs del Backend

Los logs del backend ahora muestran más información. Para verlos:

```bash
# Los logs se muestran automáticamente en la terminal donde ejecutaste:
# uvicorn app.main:app --reload
```

### Probar Directamente con la API

Puedes probar el endpoint directamente desde Swagger:

1. Abre: http://127.0.0.1:8000/docs
2. Busca el endpoint `POST /api/v1/auth/register/business`
3. Haz clic en "Try it out"
4. Usa este JSON de ejemplo:

```json
{
  "temp_token": "eyJ0ZXN0IjoidG9rZW4ifQ==",
  "name": "Mi Barbería Test",
  "business_type": "barbershop",
  "city": "Bogotá",
  "department": "Cundinamarca",
  "phone": "3001234567",
  "password": "Test123!@#",
  "confirm_password": "Test123!@#",
  "address": "Calle 123 #45-67"
}
```

5. Haz clic en "Execute"
6. Revisa la respuesta

### Errores Comunes

#### Error: "Phone must be exactly 10 digits"
- **Causa**: El teléfono no tiene exactamente 10 dígitos
- **Solución**: Usa solo números, sin espacios: `3001234567`

#### Error: "business_type must be one of: ..."
- **Causa**: El tipo de negocio no es válido
- **Solución**: Usa uno de los valores exactos listados arriba

#### Error: "Password must contain..."
- **Causa**: La contraseña no cumple los requisitos
- **Solución**: Usa una contraseña como `Test123!@#`

#### Error: "Passwords do not match"
- **Causa**: Las contraseñas no coinciden
- **Solución**: Asegúrate de escribir la misma contraseña en ambos campos

### Si el Error Persiste

1. **Verifica que el backend esté corriendo**:
   ```bash
   curl http://127.0.0.1:8000/api/v1/auth/health
   ```
   Deberías ver: `{"status":"healthy","service":"authentication","version":"1.0.0"}`

2. **Verifica la base de datos**:
   ```bash
   cd backend
   ls -la modular_saas.db
   ```
   El archivo debe existir.

3. **Reinicia el backend**:
   - Presiona `Ctrl+C` en la terminal del backend
   - Ejecuta de nuevo: `uvicorn app.main:app --reload`

4. **Limpia el navegador**:
   - Borra el caché y cookies
   - Recarga la página con `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac)

### Contacto

Si el problema persiste después de seguir estos pasos, copia:
1. El mensaje de error completo de la consola del navegador
2. Los logs del backend
3. Los datos que estás intentando enviar

Y compártelos para ayudarte a resolver el problema.

---

**Última actualización**: 2026-05-14
