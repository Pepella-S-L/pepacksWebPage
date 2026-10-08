import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hace que dist/index.html se pueda abrir con doble clic (file://):
// Chrome bloquea <script type="module"> y atributos crossorigin en file://,
// así que generamos un script clásico (IIFE) y quitamos esos atributos.
function fileProtocolCompat() {
  return {
    name: 'file-protocol-compat',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        let src = ''
        html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>\s*/, (_, s) => {
          src = s
          return ''
        })
        html = html.replace(/ crossorigin/g, '')
        return src ? html.replace('</body>', `  <script defer src="${src}"></script>\n  </body>`) : html
      },
    },
  }
}

// base './' hace que el build funcione en cualquier hosting estático
// (GitHub Pages, Netlify, Cloudflare Pages, carpeta de un servidor...).
export default defineConfig({
  base: './',
  plugins: [react(), fileProtocolCompat()],
  build: {
    rollupOptions: {
      output: { format: 'iife', inlineDynamicImports: true },
    },
  },
})
