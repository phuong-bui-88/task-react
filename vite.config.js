import laravel from 'laravel-vite-plugin';
import path from "path";
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "resources/js/components"),
            "@services": path.resolve(__dirname, "resources/js/services"),
        }
    },
    plugins: [
        laravel({
            input: [
                'resources/sass/app.scss',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
});
