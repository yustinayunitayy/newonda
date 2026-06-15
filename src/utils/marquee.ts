export function initMarquee(trackSelector: string, threshold = 4) {
  const track = document.querySelector<HTMLElement>(trackSelector)
  if (!track) return

  const items = track.querySelectorAll('[data-marquee-item]')
  if (items.length <= threshold) return

  items.forEach((item) => {
    track.appendChild(item.cloneNode(true))
  })

  const originalWidth = track.scrollWidth / 2

  track.style.setProperty('--marquee-distance', `-${originalWidth}px`)

  track.classList.add('marquee-active')
}
