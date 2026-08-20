export function toIdPhone(raw: string): string {
  let p = raw.replace(/\D/g, '')
  if (!p) return ''
  if (p.startsWith('0')) p = '62' + p.slice(1)
  return p
}
