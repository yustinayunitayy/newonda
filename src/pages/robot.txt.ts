import type { APIRoute } from 'astro'
export const GET: APIRoute = ({ site }) => {
  const isProd = import.meta.env.PUBLIC_ENV === 'production'
  const body = isProd
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\nSitemap: ${new URL('news-sitemap.xml', site).href}`
    : `User-agent: *\nDisallow: /`
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } })
}
