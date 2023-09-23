import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import million from 'million/compiler';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  }
})
