import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/", // ensures correct asset paths in production
  server: {
    host: "::", // allows local network access
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // allows '@/...' imports
    },
  },
  build: {
    outDir: "dist",
    sourcemap: mode === "development", // optional: generate sourcemaps in dev
    rollupOptions: {
      output: {
        manualChunks: undefined, // optional: avoid code splitting issues on Vercel
      },
    },
  },
}));
