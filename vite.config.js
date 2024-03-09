import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/users': 'https://vermillion-marzipan-f7ee38.netlify.app',
      // "/users": "http://localhost:3000",
    },
  },
  plugins: [react()],
});
