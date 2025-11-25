import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // Updates app automatically
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "GramSathi - Digital Empowerment",
        short_name: "GramSathi",
        description: "Learn digital skills safely and easily.",
        theme_color: "#1d4ed8", // Matches your blue-700
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png", // Ensure you have these files in /public
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // 1. Cache Google Fonts and External Images
            urlPattern:
              /^https:\/\/(fonts\.googleapis\.com|img\.youtube\.com)\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "external-resources",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // 2. Cache API GET Requests (Schemes, User Profile, Stats)
            // Strategy: NetworkFirst means "Try to get fresh data. If offline, use cache."
            urlPattern: ({ url }) =>
              url.origin === "http://localhost:8080" &&
              url.pathname.startsWith("/api/") &&
              !url.pathname.includes("progress"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // 3. Cache Static Assets (JS, CSS, Images) aggressively
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
              },
            },
          },
        ],
      },
    }),
  ],
});
