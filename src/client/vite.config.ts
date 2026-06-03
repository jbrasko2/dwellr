import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(__dirname, '.'),
            '@generated': resolve(__dirname, '../generated'),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
    },
});
