import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import type { HeroBlock } from '../../lib/data/blocks'
import { textColorMap, textPositionMap, buttonClassMap } from '../../lib/colour'

type Phase = 'intro' | 'content' | 'done'

const btnBase =
  'rounded-xl px-3 py-2 text-xs font-medium md:px-8 md:text-sm transition-all duration-200 cursor-pointer'

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
    sessionStorage.getItem('introPlayed') === '1' ? 'done' : 'intro'
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
      sessionStorage.setItem('introPlayed', '1')
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
    if (phase === 'done') {
      window.dispatchEvent(new CustomEvent('navbar:show', { detail: { delay: 0 } }))
    } else if (phase === 'content') {
      window.dispatchEvent(new CustomEvent('navbar:show', { detail: { delay: 800 } }))
    }
  }, [phase])

  function handleScroll(target: string) {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      data-component="intro-hero"
      className="relative min-h-svh w-full overflow-hidden bg-black pb-24 md:min-h-screen"
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
          src={block.image?.url}
          alt={block.image?.alt ?? headingText}
          className="absolute inset-0 h-full w-full object-cover object-center"
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
              className="text-base leading-tight font-bold md:text-3xl"
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
                className="text-sm md:text-lg"
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
                {buttons.map((btn, i) =>
                  btn.buttonType === 'scroll' ? (
                    <button
                      key={i}
                      className={`${btnBase} ${buttonClassMap[btn.variant]}`}
                      onClick={() => handleScroll(btn.scrollTarget ?? '')}
                    >
                      {btn.text}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={btn.url}
                      target={btn.openInNewTab ? '_blank' : undefined}
                      rel={btn.openInNewTab ? 'noopener noreferrer' : undefined}
                      className={`${btnBase} ${buttonClassMap[btn.variant]}`}
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
