const APP_ID = import.meta.env.LARK_APP_ID
const APP_SECRET = import.meta.env.LARK_APP_SECRET
const APP_TOKEN = import.meta.env.HR_APP_TOKEN
const TABLE_ID = import.meta.env.HR_TABLE_ID
const BASE = 'https://open.larksuite.com/open-apis'

export type Job = {
  recordId: string
  title: string
  slug: string
  jobDescription: string
  kualifikasi: string
  pendidikan: string
  jurusan: string
  statusKaryawan: string
  penempatan: string
  applyUrl: string
}

function asText(v: unknown): string {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (Array.isArray(v)) return v.map(asText).join('')
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    if ('value' in o) return asText(o.value)
    if ('text' in o) return asText(o.text)
    if ('link' in o) return asText(o.link)
    if ('name' in o) return asText(o.name)
  }
  return ''
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getToken(): Promise<string> {
  const res = await fetch(`${BASE}/auth/v3/tenant_access_token/internal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  })
  const data = await res.json()
  if (data.code !== 0) throw new Error(`Lark token error: ${JSON.stringify(data)}`)
  return data.tenant_access_token
}

async function fetchRecords(): Promise<any[]> {
  const token = await getToken()
  const items: any[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(`${BASE}/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`)
    url.searchParams.set('page_size', '100')
    if (pageToken) url.searchParams.set('page_token', pageToken)

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    if (data.code !== 0) throw new Error(`Lark records error: ${JSON.stringify(data)}`)

    items.push(...(data.data?.items ?? []))
    pageToken = data.data?.has_more ? data.data.page_token : undefined
  } while (pageToken)

  return items
}

function toJob(rec: any): Job | null {
  const f = rec.fields ?? {}
  const title = asText(f['Posisi']).trim()
  const rawPenempatan = asText(f['Penempatan']).trim()
  const penempatanValid = rawPenempatan && !rawPenempatan.startsWith('#') ? rawPenempatan : ''
  const generated = f['Generate Link Form'] === true
  const opening = asText(f['Status Text']).trim().toLowerCase()

  if (opening !== 'on process' || !generated || !title) return null

  return {
    recordId: rec.record_id,
    title,
    slug: slugify(`${title}-${penempatanValid}`),
    jobDescription: asText(f['Job Desc']).trim(),
    kualifikasi: asText(f['Kualifikasi']).trim(),
    pendidikan: asText(f['Pendidikan Text']).trim(),
    jurusan: asText(f['Jurusan']).trim(),
    statusKaryawan: asText(f['Status Karyawan Text']).trim(),
    penempatan: penempatanValid || '-',
    applyUrl: asText(f['Link Form']).trim(),
  }
}

export async function getJobs(): Promise<Job[]> {
  const records = await fetchRecords()
  return records.map(toJob).filter((j): j is Job => j !== null)
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getJobs()
  return jobs.find((j) => j.slug === slug) ?? null
}
