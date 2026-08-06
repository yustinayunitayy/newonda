import type { APIRoute } from 'astro'
export const GET: APIRoute = ({ site }) => {
  const isProd = import.meta.env.PUBLIC_ENV === 'production'
  const base = site?.href ?? 'https://onda.id/'
  const body = isProd
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', base).href}\nSitemap: ${new URL('news-sitemap.xml', base).href}`
    : `User-agent: *\nDisallow: /`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
