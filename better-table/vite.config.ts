import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			include: ["src"],
			exclude: ["src/**/*.test.tsx", "src/**/*.test.ts", "demo"],
		}),
	],
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
				styles: resolve(__dirname, "src/styles.ts"),
			},
			name: "BetterTable",
			formats: ["es", "cjs"],
			fileName: (format, entryName) => {
				if (entryName === "styles") {
					return `styles.${format === "es" ? "js" : "cjs"}`;
				}
				return `better-table.${format === "es" ? "es.js" : "cjs.js"}`;
			},
		},
		rollupOptions: {
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "style.css") {
						return "styles.css";
					}
					return assetInfo.name || "asset";
				},
			},
		},
		sourcemap: true,
		minify: "esbuild",
		cssCodeSplit: false,
	},
});
