import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type { HeroBlock } from '../../lib/data/blocks'
import { textColorMap, textPositionMap, buttonStyleMap } from '../../lib/colour'

type Phase = 'intro' | 'content' | 'done'

export default function Hero(block: HeroBlock & { videoUrl?: string }) {
  const {
    headingText,
    headingTextColor,
    subheadingText,
    subheadingTextColor,
    buttonEnabled,
    buttons,
    mediaType,
    videoUrl,
    textAlign = 'bottom-center',
  } = block

  const [videoReady, setVideoReady] = useState(false)

  const [phase, setPhase] = useState<Phase>(() =>
    sessionStorage.getItem('intro-seen') ? 'done' : 'intro'
  )

  const headingColor = textColorMap[headingTextColor]
  const subheadingColor = subheadingTextColor ? textColorMap[subheadingTextColor] : '#ffffff'
  const position = textPositionMap[textAlign] ?? textPositionMap['bottom-center']

  useEffect(() => {
    if (phase !== 'intro') return
    const t = setTimeout(() => setPhase('content'), 5000)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'content') return
    const t = setTimeout(() => {
      sessionStorage.setItem('intro-seen', 'true')
      setPhase('done')
    }, 1200)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    document.body.style.overflow = phase === 'done' ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  useEffect(() => {
    const navbar = document.getElementById('navbar')
    if (!navbar) return

    if (phase === 'done') {
      navbar.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-full')
      return
    }

    if (phase === 'content') {
      const t = setTimeout(() => {
        navbar.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-full')
      }, 800)
      return () => clearTimeout(t)
    }
  }, [phase])

  function handleScroll(target: string) {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-black pb-24 md:min-h-screen">
      {!videoReady && mediaType === 'video' && <div className="absolute inset-0 bg-black" />}

      {mediaType === 'video' ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          controls={false}
          className="absolute inset-0 h-full w-full object-cover"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={block.image?.url}
          alt={block.image?.alt ?? headingText}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <AnimatePresence>
        {phase !== 'intro' && (
          <motion.div
            key="content"
            className="absolute inset-0 flex flex-col px-6 pb-20"
            style={{
              justifyContent: position.justifyContent,
              alignItems: position.alignItems,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-base leading-tight font-bold md:text-3xl"
              style={{ color: headingColor, textAlign: position.textAlign as any }}
            >
              {headingText}
            </motion.h1>

            {subheadingText && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl text-sm md:text-lg"
                style={{ color: subheadingColor, textAlign: position.textAlign as any }}
              >
                {subheadingText}
              </motion.p>
            )}

            {buttonEnabled && buttons && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 flex flex-wrap items-center gap-3"
                style={{ justifyContent: position.alignItems }}
              >
                {buttons?.map((btn, i) =>
                  btn.type === 'scroll' ? (
                    <button
                      key={i}
                      onClick={() => handleScroll(btn.scrollTarget ?? '')}
                      className="rounded-xl px-3 py-2 text-xs font-medium md:px-8 md:text-sm"
                      style={buttonStyleMap[btn.variant]}
                    >
                      {btn.text}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={btn.url}
                      className="rounded-xl px-3 py-2 text-xs font-medium md:px-8 md:text-sm"
                      style={buttonStyleMap[btn.variant]}
                    >
                      {btn.text}
                    </a>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
