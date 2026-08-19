import type { APIRoute } from 'astro'
import { getSql } from '../../../utils/lib'

export const prerender = false

const CRON_SECRET = import.meta.env.CRON_SECRET
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY
const BREVO_LIST_ID = Number(import.meta.env.BREVO_LIST_ID)

type BrevoContact = { email: string; emailBlacklisted?: boolean }

async function fetchListContacts(): Promise<BrevoContact[]> {
  const all: BrevoContact[] = []
  const limit = 500
  let offset = 0
  const headers = { 'api-key': BREVO_API_KEY, accept: 'application/json' }

  for (;;) {
    const url = `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts?limit=${limit}&offset=${offset}`
    const res = await fetch(url, { headers })
    if (!res.ok) throw new Error(`Brevo fetch ${res.status}: ${await res.text()}`)
    const data = await res.json()
    const contacts: BrevoContact[] = data.contacts ?? []
    all.push(...contacts)
    if (contacts.length < limit) break
    offset += limit
  }
  return all
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization') || ''
  if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  try {
    const sql = getSql()
    const contacts = await fetchListContacts()
    let synced = 0

    for (const c of contacts) {
      const email = (c.email || '').trim().toLowerCase()
      if (!email) continue
      const blacklisted = c.emailBlacklisted === true
      await sql`
        insert into newsletter_subscribers (email, status, is_blacklisted)
        values (${email}, ${blacklisted ? 'unsubscribed' : 'active'}, ${blacklisted})
        on conflict (email) do update
        set synced_at = now(),
            is_blacklisted = excluded.is_blacklisted,
            status = case
              when newsletter_subscribers.status in ('unsubscribed','complaint','hard_bounce','blocked','invalid')
                then newsletter_subscribers.status
              when excluded.is_blacklisted then 'unsubscribed'
              else 'active' end`
      synced++
    }

    return json({ ok: true, total: contacts.length, synced }, 200)
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
