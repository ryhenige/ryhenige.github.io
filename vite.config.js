import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    watch: {
      usePolling: true, // Forces Vite to detect changes
    },
  },
  allowedHosts: ["localhost:5022"],
});
