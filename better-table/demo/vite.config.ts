import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Demo app configuration
export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname),
	resolve: {
		alias: {
			// Allow importing from the library source during development
			"better-table/styles.css": resolve(
				__dirname,
				"../src/components/BetterTable/styles/index.css",
			),
			"better-table": resolve(__dirname, "../src"),
		},
	},
	server: {
		port: 3000,
		open: true,
	},
});
