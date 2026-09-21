import type { APIRoute } from 'astro'
import { getNewsBySlug } from '../../../lib/data/onda-news'

export const prerender = false

export const GET: APIRoute = async ({ params, redirect }) => {
  const n = await getNewsBySlug(params.slug ?? '')
  if (!n?.coverUrl) return new Response('Not found', { status: 404 })
  const url = n.coverUrl.replace(
    /^(https?:\/\/[^/]+)(\/.*)$/,
    '$1/cdn-cgi/image/width=1000,quality=80,format=jpeg$2'
  )
  return redirect(encodeURI(url), 302)
}
