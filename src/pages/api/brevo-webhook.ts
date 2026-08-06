import type { APIRoute } from 'astro'
import { getSql } from '../../utils/lib'

export const prerender = false

const WEBHOOK_SECRET = import.meta.env.BREVO_WEBHOOK_SECRET
const sql = getSql()
function extractToken(request: Request, url: URL): string {
  const auth = request.headers.get('authorization') || ''
  const bearer = auth.replace(/^Bearer\s+/i, '').trim()
  return (
    bearer ||
    request.headers.get('x-webhook-secret') ||
    request.headers.get('token') ||
    url.searchParams.get('token') ||
    ''
  )
}

const BAD_STATUS: Record<string, string> = {
  hard_bounce: 'hard_bounce',
  unsubscribed: 'unsubscribed',
  spam: 'complaint',
  blocked: 'blocked',
  invalid_email: 'invalid',
}

export const POST: APIRoute = async ({ request, url }) => {
  console.log('[brevo-webhook] headers:', [...request.headers.keys()].join(', '))

  const provided = extractToken(request, url)
  if (!WEBHOOK_SECRET || provided !== WEBHOOK_SECRET) {
    console.warn('[brevo-webhook] token mismatch / missing')
    return json({ ok: false }, 401)
  }

  try {
    const body = await request.json()
    const event = (body.event || '').toString()
    const email = (body.email || '').toString().trim().toLowerCase()
    console.log('[brevo-webhook] event:', event, email)
    if (!email) return json({ ok: true }, 200)

    if (event === 'delivered') {
      await sql`
        insert into newsletter_subscribers (email, status)
        values (${email}, 'active')
        on conflict (email) do update
        set synced_at = now(),
            bounce_status = null,
            status = case
              when newsletter_subscribers.status in ('unsubscribed','complaint','hard_bounce','blocked','invalid')
              then newsletter_subscribers.status
              else 'active' end`
    } else if (event === 'soft_bounce') {
      await sql`
        update newsletter_subscribers
        set bounce_status = 'soft', synced_at = now()
        where email = ${email}`
    } else if (BAD_STATUS[event]) {
      await sql`
        update newsletter_subscribers
        set status = ${BAD_STATUS[event]}, is_blacklisted = true, synced_at = now()
        where email = ${email}`
    }

    return json({ ok: true }, 200)
  } catch (e) {
    console.error('Brevo webhook error:', e)
    return json({ ok: true }, 200)
  }
}

function json(d: unknown, status: number) {
  return new Response(JSON.stringify(d), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
