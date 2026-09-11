'use client'

import { ReactNode, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export interface ParallaxProps {
  children: ReactNode
  /** Translate offset in pixels (default 60). Positive moves the layer up as you scroll down. */
  offset?: number
  className?: string
}

export function Parallax({ children, offset = 60, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}
