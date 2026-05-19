import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  define: {
    global: 'window',
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://szqottgjdluhenzkqspi.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cW90dGdqZGx1aGVuemtxc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTA0ODEsImV4cCI6MjA5NDA2NjQ4MX0.q3Uzfj5XSxZzB6IvcZ4tci5it5c9Aydy_NQqpTuzX1Q')
  },
})
