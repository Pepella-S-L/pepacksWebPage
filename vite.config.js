import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' hace que el build funcione en cualquier hosting estático
// (GitHub Pages, Netlify, Cloudflare Pages, carpeta de un servidor...).
export default defineConfig({
  base: './',
  plugins: [react()],
})
