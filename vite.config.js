import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                aviso: resolve(__dirname, 'aviso-de-privacidad.html'),
                notFound: resolve(__dirname, '404.html'),
                cv: resolve(__dirname, 'cv/index.html'),
                caratula: resolve(__dirname, 'caratula.html')
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/d3')) {
                        return 'vendor-d3';
                    }
                    if (id.includes('node_modules/remotion') || id.includes('node_modules/@remotion')) {
                        return 'vendor-remotion';
                    }
                    if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
                        return 'vendor-react';
                    }
                }
            }
        }
    },
    server: {
        open: false,
    }
});
