import { defineConfig } from '@solidjs/start/config';

export default defineConfig({
    server: {
        baseURL: process.env.BASE_PATH,
        static: true,
    },
    ssr: false,
    vite: {
        define: {
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
        },
    },
});
