# Configuración de Google OAuth

## Pasos para configurar Google OAuth en Google Cloud Console

1. **Ir a Google Cloud Console**
   - Visita https://console.cloud.google.com
   - Crea un nuevo proyecto o selecciona uno existente

2. **Habilitar Google+ API**
   - Ve a "API y servicios" > "Biblioteca"
   - Busca "Google+ API" y habilitala

3. **Crear credenciales OAuth 2.0**
   - Ve a "API y servicios" > "Credenciales"
   - Click en "Crear credenciales" > "ID de cliente OAuth"
   - Selecciona "Aplicación web"

4. **Configurar la aplicación**
   - Nombre: "RMS Frontend"
   - **Orígenes autorizados de JavaScript** (IMPORTANTE):
     - http://localhost
     - http://localhost:3000
     - http://127.0.0.1
     - http://127.0.0.1:3000
     - https://tu-dominio.com (para producción)
   - **URIs de redireccionamiento autorizados**:
     - http://localhost:3000
     - http://localhost:3000/api/auth/google/callback

5. **Copiar las credenciales**
   - Copia el Client ID y actualízalo en `.env.local`:
     ```
     NEXT_PUBLIC_GOOGLE_CLIENT_ID=tu-client-id-aqui
     ```

6. **Configurar el Secret en .env.local**
   - Cambia `GOOGLE_AUTH_SECRET` por un valor seguro:
     ```
     GOOGLE_AUTH_SECRET=un-valor-secreto-seguro
     ```

## Solución de problemas comunes

### Error de CORS
Si ves errores de CORS, asegúrate de:
- Tener todos los orígenes localhost listados arriba
- No usar `localhost:3000` con protocolo https
- Esperar unos minutos después de hacer cambios en Google Console

### Error de FedCM
La implementación actual usa el componente GoogleLogin de @react-oauth/google que evita los problemas de FedCM.

## Configuración en Simple JWT Login (WordPress)

Según la documentación de Simple JWT Login, no necesitas configuración adicional en WordPress ya que estamos manejando la autenticación completamente desde nuestro backend de Next.js.

## Flujo de autenticación

1. Usuario hace click en "Login with Google"
2. Google muestra el popup de autenticación
3. Usuario autoriza la aplicación
4. Google devuelve un JWT credential
5. Nuestro backend decodifica el JWT y extrae la info del usuario
6. Si el usuario no existe, lo creamos en WordPress
7. Generamos un JWT de Simple JWT Login
8. Usuario queda autenticado en la aplicación

## Pruebas

Para probar:
1. Asegúrate de tener el servidor corriendo: `npm run dev`
2. Ve a la página de login: http://localhost:3000/login
3. Click en "Continue with Google"
4. Autoriza la aplicación
5. Deberías ser redirigido a /search con la sesión iniciada