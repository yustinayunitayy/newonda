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
function toParagraphs(text: string): string {
  return text
    .split(/\r?\n+/)
    .map((p) => clean(p))
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join('')
}
function description(j: Job): string {
  const parts: string[] = []
  if (j.overview) {
    const paras = j.overview
      .split(/\r?\n+/)
      .map((p) => clean(p))
      .filter(Boolean)
    if (paras.length > 1) {
      parts.push(`<p><strong>About Company</strong></p><p>${paras[0]}</p>`)
      parts.push(
        `<p><strong>Overview</strong></p>${paras
          .slice(1)
          .map((p) => `<p>${p}</p>`)
          .join('')}`
      )
    } else if (paras.length === 1) {
      parts.push(`<p>${paras[0]}</p>`)
    }
  }
  if (j.kualifikasi)
    parts.push(`<p><strong>What We're Looking For:</strong></p>${toHtml(j.kualifikasi)}`)
  if (j.jobDescription)
    parts.push(`<p><strong>What You'll Do:</strong></p>${toHtml(j.jobDescription)}`)
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
