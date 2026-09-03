import type { APIRoute } from 'astro'
import { getSql } from '../../utils/lib'

export const prerender = false

const APP_ID = import.meta.env.LARK_APP_ID
const APP_SECRET = import.meta.env.LARK_APP_SECRET
const APP_TOKEN = import.meta.env.AGENT_APP_TOKEN
const TABLE_ID = import.meta.env.AGENT_TABLE_ID
const BASE = 'https://open.larksuite.com/open-apis'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FIELDS = {
  name: 'Nama',
  email: 'Email',
  phone: 'No. Telp',
  company: 'Nama Toko',
  area: 'Area',
  industri: 'Industri',
  address: 'Alamat',
  jenis: 'Jenis Kemitraan',
  message: 'Pesan',
} as const

type Lead = {
  name: string
  email: string
  phone: string
  company: string
  area: string
  industri: string
  address: string
  jenis: string
  message: string
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => ({}))
  if (clean(body._hp)) return json({ ok: true }, 200)

  const lead: Lead = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 30),
    company: clean(body.company, 120),
    area: clean(body.area, 120),
    industri: clean(body.industri, 120),
    address: clean(body.address, 250),
    jenis: clean(body.jenis, 120),
    message: clean(body.message, 5000),
  }

  if (!lead.name) return json({ ok: false, error: 'Nama wajib diisi' }, 400)
  if (!EMAIL_RE.test(lead.email)) return json({ ok: false, error: 'Email tidak valid' }, 400)
  if (!lead.phone) return json({ ok: false, error: 'No. telepon wajib diisi' }, 400)
  if (!lead.jenis) return json({ ok: false, error: 'Pilih jenis kemitraan' }, 400)

  const [supa, lark] = await Promise.allSettled([saveSupabase(lead), saveLark(lead)])
  if (supa.status === 'rejected') console.error('Mitra Supabase backup error:', supa.reason)
  if (lark.status === 'rejected') console.error('Mitra Lark error:', lark.reason)

  if (supa.status === 'rejected' && lark.status === 'rejected')
    return json({ ok: false, error: 'Gagal mengirim, coba lagi.' }, 500)
  return json({ ok: true }, 200)
}

async function saveSupabase(l: Lead): Promise<void> {
  const sql = getSql()
  await sql`
    insert into mitra_submissions (name, email, phone, company, area, industri, address, jenis, message)
    values (${l.name}, ${l.email}, ${l.phone}, ${l.company}, ${l.area}, ${l.industri}, ${l.address}, ${l.jenis}, ${l.message})`
}

async function saveLark(l: Lead): Promise<void> {
  const token = await getToken()

  const fields: Record<string, unknown> = {}
  const put = (col: string, v: string) => {
    if (v) fields[col] = v
  }
  put(FIELDS.name, l.name)
  put(FIELDS.email, l.email)
  put(FIELDS.phone, l.phone)
  put(FIELDS.company, l.company)
  put(FIELDS.area, l.area)
  put(FIELDS.industri, l.industri)
  put(FIELDS.address, l.address)
  put(FIELDS.message, l.message)

  const jenisId = await findJenisRecordId(token, l.jenis)
  if (jenisId) fields[FIELDS.jenis] = [jenisId]

  const res = await fetch(`${BASE}/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  })
  const data = await res.json()
  if (data.code !== 0) throw new Error(JSON.stringify(data))
}

async function findJenisRecordId(token: string, jenisName: string): Promise<string | null> {
  const tableId = import.meta.env.AGENT_JENIS_TABLE_ID
  if (!tableId || !jenisName) {
    console.error('[jenis-link] skip: tableId?', !!tableId, 'jenis?', jenisName)
    return null
  }
  const res = await fetch(
    `${BASE}/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records?page_size=100`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  if (data.code !== 0) {
    console.error('[jenis-link] fetch error:', JSON.stringify(data))
    return null
  }
  const norm = (v: unknown): string => {
    if (Array.isArray(v)) return v.map((p: any) => p?.text ?? '').join('')
    return String(v ?? '')
  }
  const items = data.data?.items ?? []
  const names = items.map((r: any) => norm(r.fields?.['Nama Kemitraan']))
  const hit = items.find(
    (r: any) =>
      norm(r.fields?.['Nama Kemitraan']).trim().toLowerCase() === jenisName.trim().toLowerCase()
  )
  if (!hit) console.error('[jenis-link] NO MATCH. cari:', jenisName, '| yang ada:', names)
  return hit?.record_id ?? null
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

function clean(v: unknown, max = 500): string {
  return (v ?? '').toString().trim().slice(0, max)
}
function json(d: unknown, status: number) {
  return new Response(JSON.stringify(d), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
