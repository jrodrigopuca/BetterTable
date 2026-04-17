import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "better-table/styles.css": resolve(__dirname, "../better-table/src/components/BetterTable/styles/index.css"),
      "better-table": resolve(__dirname, "../better-table/src/index.ts"),
      // Ensure react resolves from storybook's node_modules when building
      // aliased better-table source files (they import react too)
      react: resolve(__dirname, "node_modules/react"),
      "react-dom": resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-runtime": resolve(__dirname, "node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": resolve(__dirname, "node_modules/react/jsx-dev-runtime"),
    },
  },
});
