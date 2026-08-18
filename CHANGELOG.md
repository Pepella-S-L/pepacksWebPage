# CHANGELOG.md

## Pepacks Web Page - Registro de Cambios

### Versión 0.1.0 - 2026-08-17

#### Nuevas características
- **Frontend completo** con React 18, Vite, React Router y TailwindCSS
- **Home** con grid de juegos, búsqueda en tiempo real, filtros por categoría y etiquetas
- **GameDetail** - vista individual de juego con stats y descarga
- **Login/Register** - autenticación de usuarios
- **AdminPanel** - panel de administración para gestionar juegos (CRUD completo)
- **UploadGame** - formulario para subir nuevos juegos con tags, imágenes y categorías
- **Sistema de cookies** conforme a normativa europea (GDPR)
  - Banner de consentimiento
  - Modal de preferencias detalladas (analítica, marketing, preferencias)
- **Seguridad implementada**
  - Content-Security-Policy
  - X-Frame-Options, X-XSS-Protection, X-Content-Type-Options
  - Referrer-Policy estricto
  - Permissions-Policy restrictivo
  - Contraseñas hasheadas con bcrypt (cost 12)
  - Protección contra XSS (sanitización htmlspecialchars)
  - Rate limiting en login (5 intentos por IP)
  - Sesiones PHP seguras (httponly, samesite, strict mode)
  - CSRF tokens

#### Backend PHP
- **API REST** completa con endpoints:
  - `GET /api/games` - lista con paginación y filtros
  - `GET /api/games/:id` - detalle de juego
  - `POST /api/games` - crear juego
  - `PUT /api/games/:id` - actualizar juego
  - `DELETE /api/games/:id` - eliminar juego
  - `POST /api/auth/login` - iniciar sesión
  - `POST /api/auth/logout` - cerrar sesión
  - `POST /api/auth/register` - registrar usuario
  - `POST /api/cookies` - registrar consentimiento
  - `POST /api/upload` - subir archivos
- **Base de datos SQLite** con esquema completo (tablas: users, games, sessions, cookies_consent, contact_messages, login_attempts)
- **GameController** y **AuthController** con validación de datos
- **Security.php** con funciones de seguridad centralizadas

#### Cambios pendientes
- [ ] Implementar proxy de Vite para redirigir /api al backend PHP
- [ ] Probar frontend + backend conectados
- [ ] Mejorar diseño responsive
- [ ] Añadir página de contacto funcional
- [ ] Implementar sistema de ratings de usuarios
- [ ] Preparar para despliegue (Vercel/otro hosting)

#### Problemas conocidos
- Los archivos PHP duplicados (`src/AuthController.php`, etc.) fueron eliminados. La versión correcta está en `api/` con namespace `Pepacks\Api`
- `node_modules` estaba en seguimiento de git (corregido con .gitignore)
