import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    // GitHub Pages serves the site from /<repo>/; the deploy workflow sets BASE_PATH.
    // Locally it stays "/".
    base: process.env.BASE_PATH ?? "/",
    devtools: {
        // Remove this `apply` property to enable devtools for build as well
        apply: "serve"
    },
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })]
});
