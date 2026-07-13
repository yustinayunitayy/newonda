export function img(url?: string, width = 1200, quality = 80): string {
  if (!url) return ''
  return url.replace(
    /^(https?:\/\/[^/]+)(\/.*)$/,
    `$1/cdn-cgi/image/width=${width},quality=${quality},format=auto$2`
  )
}
