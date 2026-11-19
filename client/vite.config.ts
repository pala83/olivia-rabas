import path from "node:path";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Where the dev proxy sends /api and /ws; override with KDS_API_URL. */
const API_TARGET = process.env.KDS_API_URL ?? "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		// File-based routes from src/routes; must stay before react().
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			quoteStyle: "double",
			semicolons: true,
		}),
		tailwindcss(),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
	server: {
		// The API runs on its own port; the browser only talks to Vite.
		proxy: {
			"/api": API_TARGET,
			"/ws": { target: API_TARGET, ws: true },
		},
	},
});
