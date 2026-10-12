const PAYLOAD_API = import.meta.env.PAYLOAD_URL
const TTL = 30_000

interface FetchOptions {
  collection: string
  where?: Record<string, any>
  limit?: number
  sort?: string
  depth?: number
  page?: number
}

const cache = new Map<string, { at: number; data: unknown; inflight?: Promise<unknown> }>()

async function cachedJson<T>(url: string): Promise<T | null> {
  const hit = cache.get(url)
  if (hit && Date.now() - hit.at < TTL) return hit.data as T
  if (hit?.inflight) return hit.inflight as Promise<T | null>

  const inflight = (async () => {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        console.error(`CMS ${res.status}: ${url}`)
        return hit ? (hit.data as T) : null
      }
      const data = (await res.json()) as T
      cache.set(url, { at: Date.now(), data })
      return data
    } catch (err) {
      console.error(`CMS error: ${url}`, err)
      return hit ? (hit.data as T) : null
    } finally {
      const cur = cache.get(url)
      if (cur) delete cur.inflight
    }
  })()

  cache.set(url, { at: hit?.at ?? 0, data: hit?.data, inflight })
  return inflight
}

export async function fetchFromCMS<T = any>({
  collection,
  where,
  limit,
  sort,
  depth,
  page,
}: FetchOptions): Promise<T | null> {
  if (!PAYLOAD_API) {
    console.error('PAYLOAD_URL not set')
    return null
  }
  const params = new URLSearchParams()
  if (where) {
    Object.entries(where).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([op, v]) => params.append(`where[${key}][${op}]`, String(v)))
      } else {
        params.append(`where[${key}][equals]`, String(value))
      }
    })
  }
  if (limit) params.append('limit', String(limit))
  if (sort) params.append('sort', sort)
  if (depth !== undefined) params.append('depth', String(depth))
  if (page) params.append('page', String(page))

  return cachedJson<T>(`${PAYLOAD_API}/api/${collection}?${params}`)
}

export async function getOne<T = any>(
  collection: string,
  where: Record<string, any>,
  depth = 1
): Promise<T | null> {
  const data = await fetchFromCMS<{ docs: T[] }>({ collection, where, limit: 1, depth })
  return data?.docs?.[0] ?? null
}

export async function fetchGlobal<T>(slug: string, depth = 1): Promise<T | null> {
  if (!PAYLOAD_API) {
    console.error('PAYLOAD_URL not set')
    return null
  }
  return cachedJson<T>(`${PAYLOAD_API}/api/globals/${slug}?depth=${depth}`)
}
