// @ts-check
import { defineConfig } from 'astro/config'
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import vercel from '@astrojs/vercel'

const env = loadEnv('', process.cwd(), '')

export default defineConfig({
  adapter: vercel({
    isr: {
      expiration: 60, // cache 60 detik, update CMS muncul maks 1 menit
    },
  }),
  site: env.SITE_URL,
  i18n: {
    defaultLocale: 'id',
    locales: ['id', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap(), icon()],
})
