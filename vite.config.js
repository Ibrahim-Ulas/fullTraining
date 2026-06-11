import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: 'views',

    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'views/index.html'),
                auth: resolve(__dirname, 'views/login.html'),
            },
        },
    },
});