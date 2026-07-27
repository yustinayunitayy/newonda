import type { APIRoute } from 'astro'
import { sql } from '../../utils/lib'

export const prerender = false

const BREVO_API_KEY = import.meta.env.BREVO_API_KEY
const SENDER_EMAIL = import.meta.env.BREVO_SENDER_EMAIL || 'noreply@onda.id'
const RECIPIENT = import.meta.env.CAREER_RECIPIENT || 'it07@onda.id'

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json()
    if (clean(body._hp)) return json({ ok: true }, 200)

    const name = clean(body.name)
    const email = clean(body.email).toLowerCase()
    const institution = clean(body.institution)
    const jenis = clean(body.jenis)
    const message = clean(body.message)

    if (!name || !institution || !jenis || !message)
      return json({ ok: false, error: 'Mohon lengkapi semua kolom.' }, 400)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return json({ ok: false, error: 'Email tidak valid.' }, 400)

    await sql`
      insert into career_submissions (name, email, institution, jenis, message, meta)
      values (${name}, ${email}, ${institution}, ${jenis}, ${message},
              ${sql.json({ page: clean(body.page) || null, referrer: request.headers.get('referer') || null })})`

    try {
      await notifyHR({ name, email, institution, jenis, message })
    } catch (err) {
      console.error('Career email error:', err)
    }

    return json({ ok: true }, 200)
  } catch (e) {
    console.error('Career form error:', e)
    return json({ ok: false, error: 'Gagal mengirim, coba lagi.' }, 500)
  }
}

async function notifyHR(d: {
  name: string
  email: string
  institution: string
  jenis: string
  message: string
}) {
  const html = `
    <h2>Halo HR Team,</h2>
    <p>Ada pengajuan baru melalui halaman Career di website ONDA.</p>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
      <tr><td><b>Nama</b></td><td>${esc(d.name)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(d.email)}</td></tr>
      <tr><td><b>Institusi/Perusahaan</b></td><td>${esc(d.institution)}</td></tr>
      <tr><td><b>Jenis Kolaborasi</b></td><td>${esc(d.jenis)}</td></tr>
      <tr><td valign="top"><b>Pesan</b></td><td>${esc(d.message).replace(/\n/g, '<br>')}</td></tr>
    </table>`
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: SENDER_EMAIL, name: 'ONDA Sanitary & Plumbing' },
      to: [{ email: RECIPIENT }],
      replyTo: { email: d.email, name: d.name },
      subject: `New Career Collaboration Inquiry - ${d.jenis}, ${d.institution}`,
      htmlContent: html,
    }),
  })
  if (!res.ok) throw new Error(await res.text())
}

function clean(v: unknown): string {
  return (v ?? '').toString().trim()
}
function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function json(d: unknown, status: number) {
  return new Response(JSON.stringify(d), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
