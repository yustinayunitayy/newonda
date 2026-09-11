import type { APIRoute } from 'astro'
import { getCatalogs } from '../../lib/data/catalog'

export const GET: APIRoute = async ({ params, redirect }) => {
  const cat = (await getCatalogs()).find((c) => c.anchor === params.anchor)
  if (!cat?.fileUrl) return new Response('Not found', { status: 404 })
  return redirect(cat.fileUrl, 302)
}
