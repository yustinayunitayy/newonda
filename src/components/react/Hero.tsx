import { motion } from 'motion/react'
import { useState } from 'react'
import type { HeroBlock } from '../../lib/data/blocks'
import { textColorMap, textPositionMap } from '../../lib/colour'
import HoverButton from './HoverButton'
import { img } from '../../lib/image'

const EASE = [0.16, 1, 0.3, 1] as const

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

  const headingColor = headingTextColor ? textColorMap[headingTextColor] : '#ffffff'
  const subheadingColor = subheadingTextColor ? textColorMap[subheadingTextColor] : '#ffffff'
  const position = textPositionMap[textAlign] ?? textPositionMap['bottom-center']

  function handleScroll(target: string) {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  const btnClass =
    'rounded-xl px-3 py-2 text-xs font-medium md:px-8 md:text-sm transition-all duration-200 cursor-pointer'

  return (
    <section className="relative min-h-[70dvh] w-full overflow-hidden bg-black md:min-h-dvh">
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

      <div
        className="section absolute inset-0 flex flex-col py-20 md:py-24"
        style={{
          justifyContent: position.justifyContent,
          alignItems: position.alignItems,
          gap: position.gap,
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
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
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
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
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="mt-2 flex flex-wrap items-center gap-3"
            style={{ justifyContent: position.alignItems }}
          >
            {buttons.map((btn, i) => {
              const isScroll = btn.buttonType === 'scroll'
              return (
                <HoverButton
                  key={i}
                  className={btnClass}
                  variant={btn.variant}
                  {...(isScroll
                    ? { onClick: () => handleScroll(btn.scrollTarget ?? '') }
                    : { href: btn.url, target: btn.openInNewTab ? '_blank' : undefined })}
                >
                  {btn.text}
                </HoverButton>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  )
}
