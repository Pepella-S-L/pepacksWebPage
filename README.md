# Indie Games Hub

Plataforma para descubrir y compartir juegos indie, estilo blog similar a gamdie.com.

## Características

- **Home**: Grid de juegos indie con búsqueda y filtros por etiquetas (solo juegos visibles)
- **Detalle de juego**: Vista completa con información, estadísticas y descarga
- **Panel Admin**: Sistema de autenticación y panel de control completo para gestionar juegos
- **Gestión de juegos**: Agregar, editar, eliminar, ocultar/mostrar juegos
- **Diseño moderno**: Interfaz responsive con TailwindCSS y gradientes
- **Iconos**: Lucide React para iconos modernos

## Tecnologías

- React 18
- Vite
- React Router
- TailwindCSS
- Lucide React

## Cómo subir tus juegos

Hay tres formas, de más a menos recomendada:

1. **Archivos en el repo** (descarga directa en tu propia web)
   - Copia el `.zip` del juego en `public/games/` (ej. `public/games/mi-juego.zip`) y la portada en `public/covers/`.
   - En el panel admin → *Añadir juego*: descarga = `games/mi-juego.zip`, portada = `covers/mi-juego.png`.
2. **Juego HTML5 jugable en la web**
   - Descomprime la build web del juego en `public/games/mi-juego/` (con su `index.html`).
   - En *URL para jugar online* pon `games/mi-juego/index.html` → aparece el botón **Jugar ahora**.
3. **Enlace externo**: pega una URL (itch.io, Google Drive, GitHub Releases...) como descarga. Recomendado para archivos grandes (GitHub limita a 100 MB por archivo).

### Publicar los cambios del panel admin

Al ser una web estática sin servidor, lo que añades en `/admin` se guarda **solo en tu navegador**. Para que lo vean todos:

1. En el panel pulsa **Exportar** (descarga `games.json`).
2. Reemplaza `src/data/games.json` con ese archivo, haz commit y push a `main`.
3. El workflow de GitHub Actions (`.github/workflows/deploy.yml`) construye y publica la web.
   Actívalo en *Settings → Pages → Source: GitHub Actions*.

También puedes editar `src/data/games.json` a mano. Campos: `id, title, description, tags, author, version, cover, downloadUrl, playUrl, downloads, visible, createdAt`.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estructura del Proyecto

```
public/
├── games/                 # Aquí van los .zip / juegos HTML5
└── covers/                # Portadas
src/
├── data/games.json        # Catálogo de juegos (fuente de verdad publicada)
├── utils.js
├── components/
│   ├── Header.jsx         # Navegación principal con autenticación
│   ├── Footer.jsx         # Pie de página
│   ├── Layout.jsx         # Layout principal
│   ├── GameCard.jsx       # Tarjeta de juego
│   ├── ProtectedRoute.jsx # Componente para proteger rutas
│   └── EditGameModal.jsx  # Modal para agregar/editar juegos
├── context/
│   ├── AuthContext.jsx    # Contexto de autenticación
│   └── GameContext.jsx    # Contexto para gestionar juegos
├── pages/
│   ├── Home.jsx           # Página principal con grid de juegos
│   ├── GameDetail.jsx     # Detalle de juego individual
│   ├── AdminPanel.jsx     # Panel de administración para gestionar juegos
│   ├── Login.jsx          # Página de login para admin
│   └── NotFound.jsx
├── App.jsx                # Configuración de rutas y providers
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

## Autenticación

El sistema incluye autenticación simple para el administrador:

- **Usuario**: admin
- **Contraseña**: admin123 (por defecto)

Cambia las credenciales copiando `.env.example` a `.env` y editando `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` (para GitHub Actions, no hay secretos: la contraseña queda en el JS publicado, así que es solo una barrera básica; los datos reales los controla quien tenga acceso al repo).

Solo el usuario autenticado puede acceder al panel de administración (`/admin`). La sesión se mantiene en localStorage.

## Panel de Administración

El panel de administración permite:
- **Ver todos los juegos**: Tabla con información completa
- **Agregar juegos**: Formulario modal para crear nuevos juegos
- **Editar juegos**: Modificar título, descripción, tags, autor, versión
- **Eliminar juegos**: Borrar juegos permanentemente
- **Ocultar/Mostrar**: Controlar visibilidad de juegos (solo los visibles aparecen en Home)
- **Buscar y filtrar**: Búsqueda por título/autor y filtro por estado