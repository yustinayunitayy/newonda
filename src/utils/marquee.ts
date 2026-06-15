export function initMarquee(trackSelector: string) {
  const track = document.querySelector<HTMLElement>(trackSelector)
  if (!track) return

  const items = track.querySelectorAll('[data-marquee-item]')
  const itemCount = items.length

  const isMobile = window.innerWidth < 768

  const shouldMarquee = isMobile ? itemCount > 2 : itemCount > 5

  if (!shouldMarquee) {
    track.classList.remove('marquee-track')
    return
  }

  if (track.dataset.initialized) return

  track.dataset.initialized = 'true'

  items.forEach((item) => {
    track.appendChild(item.cloneNode(true))
  })

  const originalWidth = track.scrollWidth / 2

  track.style.setProperty('--marquee-distance', `-${originalWidth}px`)

  track.classList.add('marquee-active')
}
