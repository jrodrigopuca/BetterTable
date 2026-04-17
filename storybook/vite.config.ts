import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "better-table/styles.css": resolve(__dirname, "../better-table/src/components/BetterTable/styles/index.css"),
      "better-table": resolve(__dirname, "../better-table/src/index.ts"),
    },
  },
});
