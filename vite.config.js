import laravel from "laravel-vite-plugin";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    optimizeDeps: {
        include: ["@workspace/ckeditor5-custom-build"],
    },
    build: {
        commonjsOptions: {
            include: [/@workspace\/ckeditor5-custom-build/, /node_modules/],
        },
        rollupOptions: {
            input: "./resources/js/app.jsx",
            external: ["./ckeditor5/build/ckeditor.js"],
        },
        sourcemap: true,
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "resources/js/components"),
            "@services": path.resolve(__dirname, "resources/js/services"),
        },
    },
    plugins: [
        laravel({
            input: ["resources/sass/app.scss", "resources/js/app.js"],
            refresh: true,
        }),
        react(),
    ],
    test: {
        // some paths to the files that are test files
        global: true,
        environment: "jsdom",
        setupFiles: "./resources/js/test/setup.js",
    },
});
