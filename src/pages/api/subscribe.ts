import type { APIRoute } from 'astro'
import { Resend } from 'resend'

export const prerender = false
const resend = new Resend(import.meta.env.RESEND_API_KEY)
const AUDIENCE_ID = import.meta.env.RESEND_AUDIENCE_ID
const WELCOME_EVENT = 'user.subscribed'

export const POST: APIRoute = async ({ request }) => {
  try {
    let email = ''
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const body = await request.json()
      email = (body.email || '').trim().toLowerCase()
    } else {
      const form = await request.formData()
      email = (form.get('email')?.toString() || '').trim().toLowerCase()
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!valid) {
      return json({ error: 'Email nggak valid' }, 400)
    }

    const existing = await resend.contacts.get({
      email,
      audienceId: AUDIENCE_ID,
    })

    if (existing.data) {
      return json({ ok: true, already: true }, 200)
    }

    const { error: createError } = await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    })

    if (createError) {
      console.error('Create contact error:', createError)
      return json({ error: 'Gagal subscribe, coba lagi' }, 500)
    }

    await resend.events.send({
      event: WELCOME_EVENT,
      email,
    })

    return json({ ok: true }, 200)
  } catch (err) {
    console.error('Subscribe error:', err)
    return json({ error: 'Gagal subscribe, coba lagi' }, 500)
  }
}

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
