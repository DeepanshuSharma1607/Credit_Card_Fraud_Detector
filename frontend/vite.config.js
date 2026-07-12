import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_BACKEND_ORIGIN || 'http://127.0.0.1:8000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: {
        // Forwards /api/* to the FastAPI backend so the browser never
        // needs the backend to send CORS headers during development.
        '/api': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
