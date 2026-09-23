import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: false,
    // Dev-only: proxies /api/v1 to the local Node backend so the browser
    // sees it as same-origin — the cookie-session + CSRF flow in
    // migration-plan/REACT_AUTH_AND_APP_SWITCH_FLOW.md needs that; a
    // cross-origin dev server can't set/read the session cookie cleanly.
    // Override the target with VITE_DEV_API_PROXY_TARGET if the backend
    // runs on a different port.
    proxy: {
      '/api/v1': {
        target: process.env.VITE_DEV_API_PROXY_TARGET ?? 'http://localhost:4300',
        changeOrigin: true,
      },
    },
  },
})
