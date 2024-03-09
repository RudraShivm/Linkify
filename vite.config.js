import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users': 'https://linkify-3pk6.onrender.com',
      // "/users": "http://localhost:3000",
    },
  },
  plugins: [react()],
});
