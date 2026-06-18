export function initMarquee(trackSelector: string) {
  const track = document.querySelector<HTMLElement>(trackSelector)
  if (!track) return

  const items = track.querySelectorAll<HTMLElement>('[data-marquee-item]')
  const itemCount = items.length

  const isMobile = /Mobi|Android/i.test(navigator.userAgent)

  const shouldMarquee = isMobile ? itemCount > 2 : itemCount > 5
  console.log({ itemCount, isMobile, shouldMarquee })

  if (!shouldMarquee) {
    track.classList.remove('marquee-active')
    return
  }

  if (track.dataset.initialized) return
  track.dataset.initialized = 'true'

  const containerWidth = track.parentElement!.getBoundingClientRect().width
  const columns = isMobile ? 2 : 5
  const itemWidth = containerWidth / columns

  track.style.setProperty('--marquee-item-width', `${itemWidth}px`)

  items.forEach((item) => {
    track.appendChild(item.cloneNode(true))
  })

  const setWidth = itemWidth * itemCount
  const pixelsPerSecond = 80
  const duration = setWidth / pixelsPerSecond

  track.style.setProperty('--marquee-duration', `${duration}s`)

  track.classList.add('marquee-active')
}
