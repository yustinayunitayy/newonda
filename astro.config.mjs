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
  output: 'server',
  adapter: vercel({
    isr: {
      expiration: 60,
      exclude: [/^\/api\//, /^\/robots\.txt$/],
    },
  }),
  site: env.SITE_URL,
  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), sitemap(), icon()],
})
