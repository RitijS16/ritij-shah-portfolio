import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173, strictPort: true, allowedHosts: true },
  preview: { host: true, port: 4173, allowedHosts: true },
  build: {
    // Split the big libraries into their own long-cached files.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) return 'gsap'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react'
        },
      },
    },
  },
})
