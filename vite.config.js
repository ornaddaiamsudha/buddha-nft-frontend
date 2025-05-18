import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',            // make sure root is current directory
  publicDir: 'public',  // optional if you're using public/
  build: {
    outDir: 'dist'
  }
})
