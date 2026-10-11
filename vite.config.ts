import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (chaohsuchen.github.io) is served from the domain root, so base = '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
