import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                cv: resolve(__dirname, 'cv/index.html')
            }
        }
    },
    server: {
        // Para asegurar que /cv redirija correctamente a /cv/ o sirva su index.html
        open: false,
    }
});
