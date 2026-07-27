import type { APIRoute } from 'astro'

export const prerender = false

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY
const BREVO_LIST_ID = Number(import.meta.env.BREVO_LIST_ID)
const TURNSTILE_SECRET = import.meta.env.TURNSTILE_SECRET_KEY

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    let email = ''
    let token = ''
    let hp = ''
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      email = (body.email || '').trim().toLowerCase()
      token = (body.token || '').toString()
      hp = (body._hp || '').toString().trim()
    } else {
      const form = await request.formData()
      email = (form.get('email')?.toString() || '').trim().toLowerCase()
      token = form.get('cf-turnstile-response')?.toString() || form.get('token')?.toString() || ''
      hp = (form.get('_hp')?.toString() || '').trim()
    }

    if (hp) return json({ status: 'ok' }, 200)

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) return json({ error: 'Email tidak valid' }, 400)
    const okCaptcha = await verifyTurnstile(token, clientAddress)
    if (!okCaptcha) return json({ error: 'Verifikasi keamanan gagal. Coba lagi.' }, 400)

    const headers = {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    }

    const check = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      headers,
    })

    if (check.ok) {
      const contact = await check.json()

      if (contact.emailBlacklisted) return json({ status: 'unsubscribed' }, 200)
      if (contact.listIds?.includes(BREVO_LIST_ID)) return json({ status: 'already' }, 200)

      const add = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts/add`,
        { method: 'POST', headers, body: JSON.stringify({ emails: [email] }) }
      )
      if (!add.ok) {
        console.error('Brevo add-to-list error:', await add.text())
        return json({ error: 'Gagal subscribe, coba lagi' }, 500)
      }
      return json({ status: 'ok' }, 200)
    }

    if (check.status !== 404) {
      console.error('Brevo lookup error:', await check.text())
      return json({ error: 'Gagal subscribe, coba lagi' }, 500)
    }

    const create = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, listIds: [BREVO_LIST_ID] }),
    })

    if (!create.ok) {
      console.error('Brevo create error:', await create.text())
      return json({ error: 'Gagal subscribe, coba lagi' }, 500)
    }

    return json({ status: 'ok' }, 200)
  } catch (err) {
    console.error('Subscribe error:', err)
    return json({ error: 'Gagal subscribe, coba lagi' }, 500)
  }
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
    })
    const data = await res.json()
    return data.success === true
  } catch (e) {
    console.error('Turnstile verify error:', e)
    return false
  }
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
