// import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { comlink } from 'vite-plugin-comlink';
import { ghPages } from 'vite-plugin-gh-pages';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        comlink(),
        ghPages({
            branch: 'gh-pages', // Just ignore the error. It works.
        }),
    ],
    server: {
        port: 3000,
    },
    define: {
        'process.env': process.env,
    },
    base: '/mariaverse/',
    test: {
        globals: true,
    },
    worker: {
        plugins: [comlink()],
    },
});
