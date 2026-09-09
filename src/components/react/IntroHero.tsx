import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type { HeroBlock } from '../../lib/data/blocks'
import { resolveColor, textPositionMap } from '../../lib/colour'
import { ButtonGroup } from './HoverButton'
import { img } from '../../lib/image'

type Phase = 'intro' | 'content' | 'done'

// Timing (ms)
const INTRO_MS = 3000
const CONTENT_MS = 1200
const NAVBAR_DELAY_MS = 800

export default function IntroHero(block: HeroBlock & { videoUrl?: string }) {
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

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => window.dispatchEvent(new Event('hero:mounted')))
    )
    return () => cancelAnimationFrame(raf)
  }, [])

  const [phase, setPhase] = useState<Phase>(() =>
    typeof window !== 'undefined' && sessionStorage.getItem('intro-seen') ? 'done' : 'intro'
  )
  const headingColor = resolveColor(headingTextColor, 'white')
  const subheadingColor = resolveColor(subheadingTextColor, 'white')
  const position = textPositionMap[textAlign] ?? textPositionMap['bottom-center']

  useEffect(() => {
    if (phase !== 'intro') return
    const t = setTimeout(() => setPhase('content'), INTRO_MS)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'content') return
    const t = setTimeout(() => {
      sessionStorage.setItem('intro-seen', 'true')
      setPhase('done')
    }, CONTENT_MS)
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
      }, NAVBAR_DELAY_MS)
      return () => clearTimeout(t)
    }
  }, [phase])

  const btnClass =
    'rounded-xl px-3 py-2 font-medium md:px-8 text-button transition-all duration-200 cursor-pointer'

  return (
    <section
      className={`relative w-full overflow-hidden bg-black transition-[min-height] duration-700 ease-out ${
        phase === 'intro' ? 'min-h-svh' : 'min-h-[75svh] md:min-h-[90vh]'
      }`}
    >
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
          src={img(block.image?.url, 1600)}
          alt={block.image?.alt ?? headingText}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <AnimatePresence>
        {phase !== 'intro' && (
          <motion.div
            key="content"
            className="absolute inset-0 flex flex-col px-10 pb-20 md:px-16"
            style={{
              justifyContent: position.justifyContent,
              alignItems: position.alignItems,
              gap: position.gap,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-h2 leading-tight font-bold"
              style={{
                color: headingColor,
                textAlign: position.textAlign as React.CSSProperties['textAlign'],
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                maxWidth: position.maxWidth,
              }}
            >
              {headingText}
            </motion.h1>

            {subheadingText && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-body"
                style={{
                  color: subheadingColor,
                  textAlign: position.textAlign as React.CSSProperties['textAlign'],
                  textShadow: '0 1px 8px rgba(0,0,0,0.4)',
                  maxWidth: position.maxWidth,
                }}
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
                <ButtonGroup buttons={buttons} className={btnClass} />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
