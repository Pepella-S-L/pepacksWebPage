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
src/
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
│   └── Login.jsx          # Página de login para admin
├── App.jsx                # Configuración de rutas y providers
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

## Autenticación

El sistema incluye autenticación simple para el administrador:

- **Usuario**: admin
- **Contraseña**: admin123

Solo el usuario autenticado puede acceder al panel de administración (`/admin`). La sesión se mantiene en localStorage.

## Panel de Administración

El panel de administración permite:
- **Ver todos los juegos**: Tabla con información completa
- **Agregar juegos**: Formulario modal para crear nuevos juegos
- **Editar juegos**: Modificar título, descripción, tags, autor, versión
- **Eliminar juegos**: Borrar juegos permanentemente
- **Ocultar/Mostrar**: Controlar visibilidad de juegos (solo los visibles aparecen en Home)
- **Buscar y filtrar**: Búsqueda por título/autor y filtro por estado