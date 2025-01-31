import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
    ssr: false,
    server: {
        baseURL: process.env.BASE_PATH,
        static: true,
        prerender: {
            crawlLinks: true,
        },
    },
    vite: {
        define: {
            APP_VERSION: JSON.stringify(process.env.npm_package_version),
        },
    },
});
