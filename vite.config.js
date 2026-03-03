import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                cv: resolve(__dirname, 'cv/index.html')
            }
        }
    },
    server: {
        open: false,
    }
});
