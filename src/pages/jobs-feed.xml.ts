import type { APIContext } from 'astro'
import { getJobs, type Job } from '../lib/data/job'

export const prerender = false

const COMPANY = 'PT Onda Mega Integra'
const POSTER_EMAIL = import.meta.env.LINKEDIN_POSTER_EMAIL ?? ''
const COMPANY_ID = import.meta.env.LINKEDIN_COMPANY_ID ?? ''

const cdata = (s: string) => `<![CDATA[${s.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`
const clean = (s: string) => s.replace(/[<>]/g, '').trim()

function toHtml(text: string): string {
  const lines = text
    .split(/\r?\n/)
    .map((l) => clean(l.replace(/^\s*(\d+[.)]|[-•*])\s*/, '')))
    .filter(Boolean)
  if (lines.length === 0) return ''
  if (lines.length === 1) return `<p>${lines[0]}</p>`
  return `<ul>${lines.map((l) => `<li>${l}</li>`).join('')}</ul>`
}

function description(j: Job): string {
  const parts: string[] = []
  if (j.jobDescription)
    parts.push(`<p><strong>Deskripsi Pekerjaan</strong></p>${toHtml(j.jobDescription)}`)
  if (j.kualifikasi) parts.push(`<p><strong>Kualifikasi</strong></p>${toHtml(j.kualifikasi)}`)
  const extra = [
    j.pendidikan && `Pendidikan: ${clean(j.pendidikan)}`,
    j.jurusan && `Jurusan: ${clean(j.jurusan)}`,
    j.statusKaryawan && `Status: ${clean(j.statusKaryawan)}`,
  ].filter(Boolean) as string[]
  if (extra.length) parts.push(`<p>${extra.join('<br>')}</p>`)
  return parts.join('')
}

function jobType(s: string): string {
  const t = s.toLowerCase()
  if (/intern|magang/.test(t)) return 'INTERNSHIP'
  if (/kontrak|contract/.test(t)) return 'CONTRACT'
  if (/part/.test(t)) return 'PART_TIME'
  if (/tetap|full|permanen/.test(t)) return 'FULL_TIME'
  return ''
}

function city(penempatan: string): string {
  const c = clean(penempatan.replace(/\(.*?\)/g, ''))
  return c || 'Jakarta Utara'
}

export async function GET({ site }: APIContext) {
  const base = site?.href ?? 'https://onda.id/'
  const jobs = await getJobs()

  const items = jobs
    .map((j) => {
      const desc = description(j)
      if (desc.length < 100) return ''
      const c = city(j.penempatan)
      const type = jobType(j.statusKaryawan)
      return `  <job>
    <partnerJobId>${cdata(j.recordId)}</partnerJobId>
    <company>${cdata(COMPANY)}</company>
    <title>${cdata(clean(j.title))}</title>
    <description>${cdata(desc)}</description>
    <applyUrl>${cdata(new URL(`/life-at-onda/jobs/${j.slug}`, base).href)}</applyUrl>
${COMPANY_ID ? `    <companyId>${cdata(COMPANY_ID)}</companyId>\n` : ''}    <location>${cdata(`${c}, Indonesia`)}</location>
    <city>${cdata(c)}</city>
    <country>${cdata('ID')}</country>
    <workplaceTypes>${cdata('On-site')}</workplaceTypes>
${type ? `    <jobtype>${cdata(type)}</jobtype>\n` : ''}    <posterEmail>${cdata(POSTER_EMAIL)}</posterEmail>
  </job>`
    })
    .filter(Boolean)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <publisherUrl>${base}</publisherUrl>
  <publisher>${COMPANY}</publisher>
  <expectedJobCount>${items.length}</expectedJobCount>
${items.join('\n')}
</source>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=600',
    },
  })
}
