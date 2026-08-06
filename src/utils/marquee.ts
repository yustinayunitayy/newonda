export function initMarquee(trackSelector: string) {
  const track = document.querySelector<HTMLElement>(trackSelector)
  if (!track) return

  const items = track.querySelectorAll<HTMLElement>('[data-marquee-item]')
  const itemCount = items.length

  const w = window.innerWidth
  const isMobile = w < 768
  const isTablet = w >= 768 && w < 1024

  const columns = isMobile ? 2 : isTablet ? 3 : 5

  const shouldMarquee = itemCount > columns

  if (!shouldMarquee) {
    track.classList.remove('marquee-active')
    return
  }

  if (track.dataset.initialized) return
  track.dataset.initialized = 'true'

  const containerWidth =
    track.parentElement?.getBoundingClientRect().width ?? track.getBoundingClientRect().width
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
