import type { APIRoute } from 'astro'
import { getSql } from '../../utils/lib'

export const prerender = false

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    if (clean(body._hp)) return json({ ok: true }, 200) // honeypot

    const name = clean(body.name, 120)
    const email = clean(body.email, 160).toLowerCase()
    const phone = clean(body.phone, 30)

    if (!name) return json({ ok: false, error: 'Nama wajib diisi' }, 400)
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Email tidak valid' }, 400)

    const sql = getSql()
    const meta = sql.json({
      page: clean(body.page, 300) || null,
      referrer: request.headers.get('referer') || null,
      user_agent: request.headers.get('user-agent') || null,
    })

    await sql`
      insert into contact_submissions (name, email, phone, subject, message, meta)
      values (${name}, ${email}, ${phone},
              ${clean(body.subject, 200)}, ${clean(body.message, 5000)}, ${meta})`

    return json({ ok: true }, 200)
  } catch (e) {
    console.error('Contact insert error:', e)
    return json({ ok: false, error: 'gagal simpan' }, 500)
  }
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
