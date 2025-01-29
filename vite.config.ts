import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const basenameProd = '';

export default defineConfig(({ command }) => {
    const isProd = command === 'build';

    return {
        base: isProd ? basenameProd : '',
        plugins: [
            react(),
            VitePWA({
                registerType: 'autoUpdate',
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                },
                manifest: {
                    name: 'YonStore',
                    short_name: 'YonStore',
                    theme_color: '#ffffff',
                    background_color: '#ffffff',
                    display: 'fullscreen',
                    start_url: isProd ? `${basenameProd}` : '/',
                    icons: [
                        {
                            src: `${basenameProd}icons/icon192x192.svg`,
                            sizes: '192x192',
                            type: 'image/svg',
                        },
                        {
                            src: `${basenameProd}icons/icon512x512.svg`,
                            sizes: '512x512',
                            type: 'image/svg',
                        },
                    ],
                },
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        define: {
            global: {
                basename: isProd ? basenameProd : '',
            },
        },
    };
});
