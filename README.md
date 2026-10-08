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

### Opción rápida: comando `add-game`

```bash
npm run add-game -- --title "Mi Juego" --author "Yo" --description "Texto" \
  --tags "Aventura,Pixel Art" --platforms "Windows,Web" \
  --cover ./portada.png --file ./mi-juego.zip --featured
```

Copia la portada a `public/covers/` y el archivo a `public/games/`, y añade el juego a `src/data/games.json`.
Después `git add . && git commit && git push` y se publica solo.

### A mano

1. **Descarga propia**: copia el `.zip` en `public/games/` y la portada en `public/covers/`; en `games.json` usa `"downloadUrl": "games/mi-juego.zip"`.
2. **Jugable en la web (HTML5)**: descomprime la build web en `public/games/mi-juego/` y usa `"playUrl": "games/mi-juego/index.html"` → aparece el botón **Jugar ahora**.
3. **Enlace externo** (itch.io, Drive, GitHub Releases...): pon la URL en `downloadUrl`. Recomendado para archivos grandes (GitHub limita a 100 MB por archivo).

`npm run build` valida `games.json` (campos, ids únicos y que existan los archivos referenciados) y falla si algo está mal. Puedes lanzar solo la validación con `npm run check`.

Campos de un juego: `id, title, description, tags, platforms, author, version, cover, screenshots, downloadUrl, playUrl, featured, visible, createdAt`.

### Panel admin (borradores)

Al ser una web estática, lo que editas en `/admin` es un **borrador guardado solo en tu navegador**: los visitantes siguen viendo `src/data/games.json`. Para publicarlo: **Exportar** → reemplaza `src/data/games.json` → commit y push. El workflow de GitHub Actions construye y publica la web (activa *Settings → Pages → Source: GitHub Actions*).

## Probar en local

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:5173
```

Para probar el build: `npm run build` y abre `dist/index.html` con doble clic (funciona sin servidor) o `npm run preview`.

> ⚠️ No abras el `index.html` de la **raíz** con doble clic: es el de desarrollo y sale en blanco. Usa `npm start`.

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
scripts/
├── check-games.mjs        # Valida games.json (se ejecuta en cada build)
└── add-game.mjs           # Añade un juego desde la terminal
src/
├── data/games.json        # Catálogo de juegos (fuente de verdad publicada)
├── lib/games.js           # Modelo de datos y utilidades
├── hooks/useDocumentTitle.js
├── utils.js
├── components/
│   ├── ErrorBoundary.jsx  # Muestra errores en vez de pantalla en blanco
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

En local, cambia las credenciales copiando `.env.example` a `.env` y editando `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` (para GitHub Actions, no hay secretos: la contraseña queda en el JS publicado, así que es solo una barrera básica; los datos reales los controla quien tenga acceso al repo).

Solo el usuario autenticado puede acceder al panel de administración (`/admin`). La sesión se mantiene en localStorage.

## Panel de Administración

El panel de administración permite:
- **Ver todos los juegos**: Tabla con información completa
- **Agregar juegos**: Formulario modal para crear nuevos juegos
- **Editar juegos**: Modificar título, descripción, tags, autor, versión
- **Eliminar juegos**: Borrar juegos permanentemente
- **Ocultar/Mostrar**: Controlar visibilidad de juegos (solo los visibles aparecen en Home)
- **Buscar y filtrar**: Búsqueda por título/autor y filtro por estado

### Contraseña en la web publicada

En el repo: *Settings → Secrets and variables → Actions* y crea `VITE_ADMIN_USER` y `VITE_ADMIN_PASS`. El workflow los usa al construir. Si no existen, se usan `admin` / `admin123`.
