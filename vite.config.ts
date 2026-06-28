import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Dev proxy: forward /api + /up to the running Moreno.API (default :5000).
    // Override with VITE_API_TARGET if your backend runs elsewhere.
    proxy: {
      '/api': { target: process.env.VITE_API_TARGET ?? 'http://localhost:5000', changeOrigin: true },
      '/up': { target: process.env.VITE_API_TARGET ?? 'http://localhost:5000', changeOrigin: true },
    },
  },
})
