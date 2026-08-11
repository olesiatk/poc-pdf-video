import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set VITE_BASE_PATH in CI when deploying to a GitHub Pages project site
  // (served from /<repo-name>/ instead of the domain root).
  base: process.env.VITE_BASE_PATH || '/',
})
