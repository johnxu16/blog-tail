'use client'

import { useState, useEffect, useRef } from 'react'
import LoadingSpinner from './SegmentLoading'
import { useEventListener, useRafTimeout } from 'ahooks'
import { cn } from '@/lib/utils'

interface Props {
  holdTime?: number
  size?: number
}

export default function Revolver({ holdTime = 1000, size = 80 }: Props) {
  const ref = useRef(null)
  const [isHolding, setIsHolding] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [position, setPosition] = useState({ x: 704, y: 151 })
  const [showSpinner, setShowSpinner] = useState(true)
  const [showOption, setShowOption] = useState(true)
  const holdTimer = useRef<NodeJS.Timeout>()

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return

    setPosition({ x: e.clientX, y: e.clientY })
    setIsHolding(true)
    setIsAnimating(true)

    setShowSpinner(true)

    holdTimer.current = setTimeout(() => {
      setShowOption(true)
      setIsAnimating(false)
    }, holdTime)
  }

  const handleMouseUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = undefined
    }
    setIsHolding(false)
    setShowSpinner(false)
    setShowOption(false)
  }

  const move = (x, y) => {
    setPosition({ x, y })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isHolding) {
      requestAnimationFrame(() => move(e.clientX, e.clientY))
    }
  }

  useEventListener('mousedown', handleMouseDown, { target: ref })
  useEventListener('mouseup', handleMouseUp, { target: ref })
  useEventListener('mousemove', handleMouseMove, { target: ref })

  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
        holdTimer.current = undefined
      }
    }
  }, [])

  return (
    <div
      className="relative h-full min-h-full w-full min-w-full cursor-pointer overflow-hidden"
      ref={ref}
    >
      {showSpinner && (
        <>
          <div
            className="pointer-events-none absolute z-50"
            style={{ left: position.x - size / 2, top: position.y - size / 2 }}
          >
            <LoadingSpinner
              size={size}
              gapSize={0.6}
              speed={1}
              segments={8}
              segmentType="arc"
              state={isAnimating}
            />
          </div>
          {/* <div
            className={cn(
              'pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full border-2 bg-blue-500',
              `h-[${size}]px w-[${size}]px`
            )} // Adjust the size of the ping effect
            style={{ left: position.x, top: position.y, transformOrigin: 'center' }}
          ></div> */}
        </>
      )}
      {showOption && (
        <section
          className="absolute z-50 mr-1 box-border flex h-20 select-none flex-col items-start justify-center gap-y-2 p-2"
          style={{ left: position.x + size / 2, top: position.y - size / 2 }}
        >
          <div className="px-2 text-xl text-zinc-600">projects</div>
          <div className="px-2 text-xl text-zinc-600">talks</div>
          <div className="px-2 text-xl text-zinc-600">blogs</div>
        </section>
      )}
    </div>
  )
}
