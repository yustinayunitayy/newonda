import type { APIRoute } from 'astro'
import { getSql } from '../../../utils/lib'

export const prerender = false

const CRON_SECRET = import.meta.env.CRON_SECRET
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY
const BREVO_LIST_ID = Number(import.meta.env.BREVO_LIST_ID)
const BREVO_POPUP_LIST_ID = Number(import.meta.env.BREVO_POPUP_LIST_ID)

type BrevoContact = {
  email: string
  emailBlacklisted?: boolean
  attributes?: { SOURCE?: string }
}

async function fetchListContacts(listId: number): Promise<BrevoContact[]> {
  const all: BrevoContact[] = []
  const limit = 500
  let offset = 0
  const headers = { 'api-key': BREVO_API_KEY, accept: 'application/json' }

  for (;;) {
    const url = `https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`Brevo fetch list ${listId} ${res.status}: ${await res.text()}`)
    const data = await res.json()
    const contacts: BrevoContact[] = data.contacts ?? []
    all.push(...contacts)
    if (contacts.length < limit) break
    offset += limit
  }
  return all
}

async function syncListToTable(listId: number, table: string) {
  const sql = getSql()
  const contacts = await fetchListContacts(listId)
  let synced = 0

  for (const c of contacts) {
    const email = (c.email || '').trim().toLowerCase()
    if (!email) continue
    const blacklisted = c.emailBlacklisted === true
    const source = (c.attributes?.SOURCE || '').toString().trim().toLowerCase() || null
    await sql`
      insert into ${sql(table)} (email, status, is_blacklisted, source, synced_at)
      values (${email}, ${blacklisted ? 'unsubscribed' : 'active'}, ${blacklisted}, ${source}, now())
      on conflict (email) do update
      set synced_at = now(),
          is_blacklisted = excluded.is_blacklisted,
          source = coalesce(excluded.source, ${sql(table)}.source),
          status = case
            when ${sql(table)}.status in ('unsubscribed','complaint','hard_bounce','blocked','invalid')
              then ${sql(table)}.status
            when excluded.is_blacklisted then 'unsubscribed'
            else 'active' end`
    synced++
  }
  return { total: contacts.length, synced }
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization') || ''
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  try {
    const newsletter = await syncListToTable(BREVO_LIST_ID, 'newsletter_subscribers')
    const popup = BREVO_POPUP_LIST_ID
      ? await syncListToTable(BREVO_POPUP_LIST_ID, 'popup_subscribers')
      : { total: 0, synced: 0 }

    return json({ ok: true, newsletter, popup }, 200)
  } catch (e) {
    console.error('[cron sync-brevo] error:', e)
    return json({ ok: false, error: (e as Error).message }, 500)
  }
}

function json(d: unknown, status: number) {
  return new Response(JSON.stringify(d), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
