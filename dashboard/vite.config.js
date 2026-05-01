import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/grc": {
        target: "http://localhost:4000",
        rewrite: (path) => path.replace(/^\/grc/, ""),
        headers: { "X-API-Key": "localdev" },
      },
    },
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
