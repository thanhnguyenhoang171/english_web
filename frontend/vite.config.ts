import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';
import path from 'path';
//running on localhost instead of IP 127.0.0.1
// https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim');
// fixing
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [
            react(),
            // visualizer() as PluginOption
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            port: parseInt(env.PORT),
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL, // backend URL
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
