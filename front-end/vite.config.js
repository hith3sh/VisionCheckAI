import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // This makes it work in Docker/Nginx
  plugins: [react()],
})
