import type { APIRoute } from 'astro'

export const prerender = false

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY
const BREVO_LIST_ID = Number(import.meta.env.BREVO_LIST_ID)

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
    if (!valid) return json({ error: 'Email tidak valid' }, 400)

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      if (err?.code === 'duplicate_parameter') return json({ ok: true, already: true }, 200)
      console.error('Brevo error:', err)
      return json({ error: 'Gagal subscribe, coba lagi' }, 500)
    }

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
