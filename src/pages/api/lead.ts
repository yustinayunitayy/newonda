import type { APIRoute } from 'astro'
import { sql } from '../../utils/lib'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    if (clean(body._hp)) return json({ ok: true }, 200)

    const type = clean(body.type)
    const meta = sql.json({
      page: clean(body.page) || null,
      referrer: request.headers.get('referer') || null,
      user_agent: request.headers.get('user-agent') || null,
    })

    if (type === 'contact') {
      await sql`
        insert into contact_submissions (name, email, phone, subject, message, meta)
        values (${clean(body.name)}, ${clean(body.email)}, ${clean(body.phone)},
                ${clean(body.subject)}, ${clean(body.message)}, ${meta})`
    } else if (type === 'mitra') {
      await sql`
        insert into mitra_submissions (name, email, phone, company, area, industri, jenis, message, meta)
        values (${clean(body.name)}, ${clean(body.email)}, ${clean(body.phone)},
                ${clean(body.company)}, ${clean(body.area)}, ${clean(body.industri)},
                ${clean(body.jenis)}, ${clean(body.message)}, ${meta})`
    } else {
      return json({ ok: false, error: 'unknown type' }, 400)
    }

    return json({ ok: true }, 200)
  } catch (e) {
    console.error('Lead insert error:', e)
    return json({ ok: false, error: 'gagal simpan' }, 500)
  }
}

function clean(v: unknown): string {
  return (v ?? '').toString().trim()
}
function json(d: unknown, status: number) {
  return new Response(JSON.stringify(d), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
