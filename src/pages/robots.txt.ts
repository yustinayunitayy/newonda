import type { APIRoute } from 'astro'
export const GET: APIRoute = ({ site, request }) => {
  const isProd = import.meta.env.PUBLIC_ENV === 'production'
  const host = new URL(request.url).hostname
  const isProdHost = host === 'onda.id' || host === 'www.onda.id'
  const base = site?.href ?? 'https://onda.id/'
  const body =
    isProd && isProdHost
      ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', base).href}\nSitemap: ${new URL('news-sitemap.xml', base).href}`
      : `User-agent: *\nDisallow: /`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
