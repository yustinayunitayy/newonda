const PAYLOAD_API = import.meta.env.PAYLOAD_URL

interface FetchOptions {
  collection: string
  where?: Record<string, any>
  limit?: number
  sort?: string
  depth?: number
  page?: number
}

export async function fetchFromCMS<T = any>({
  collection,
  where,
  limit,
  sort,
  depth,
  page,
}: FetchOptions): Promise<T | null> {
  try {
    if (!PAYLOAD_API) {
      console.error('PAYLOAD_URL not set')
      return null
    }

    const params = new URLSearchParams()

    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          Object.entries(value).forEach(([operator, operatorValue]) => {
            params.append(`where[${key}][${operator}]`, String(operatorValue))
          })
        } else {
          params.append(`where[${key}][equals]`, String(value))
        }
      })
    }

    if (limit) params.append('limit', String(limit))
    if (sort) params.append('sort', sort)
    if (depth !== undefined) params.append('depth', String(depth))
    if (page) params.append('page', String(page))

    const res = await fetch(`${PAYLOAD_API}/api/${collection}?${params.toString()}`)

    if (!res.ok) {
      console.error(`Failed to fetch ${collection}:`, res.status)
      return null
    }

    return res.json() as Promise<T>
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    return null
  }
}

export async function getOne<T = any>(
  collection: string,
  where: Record<string, any>,
  depth = 1
): Promise<T | null> {
  const data = await fetchFromCMS<{ docs: T[] }>({
    collection,
    where,
    limit: 1,
    depth,
  })
  return data?.docs?.[0] ?? null
}

// Payload globals
export async function fetchGlobal<T>(slug: string, depth = 1): Promise<T | null> {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/${slug}?depth=${depth}`)
    if (!res.ok) return null
    return res.json() as Promise<T>
  } catch {
    return null
  }
}
