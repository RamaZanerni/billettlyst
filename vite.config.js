import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      '/discovery': {
        target: 'https://app.ticketmaster.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/discovery/, '/discovery')
      }
    }
  }
  
})



