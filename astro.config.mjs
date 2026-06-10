// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const env = loadEnv("", process.cwd(), "");
console.log("SITE_URL:", env.SITE_URL);

export default defineConfig({
  site: env.SITE_URL,

  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap()],
});
