'use client'

import { useState, useEffect, useRef } from 'react'
import LoadingSpinner from './SegmentLoading'
import { useEventListener, useRafTimeout } from 'ahooks'

interface Props {
  items: object[]
}

export default function Revolver({ holdTime = 30 }: { holdTime?: number }) {
  const ref = useRef(null)
  const [isHolding, setIsHolding] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showSpinner, setShowSpinner] = useState(false)
  const [showOption, setShowOption] = useState(false)
  const holdTimer = useRef<NodeJS.Timeout>()

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return

    setPosition({ x: e.clientX, y: e.clientY })
    setIsHolding(true)

    setShowSpinner(true)

    holdTimer.current = setTimeout(() => {
      setShowOption(true)
    }, holdTime)
  }

  const handleMouseUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = undefined
    }
    setIsHolding(false)
    setShowSpinner(false)
  }

  // const handleMouseMove = (e: MouseEvent) => {
  //   if (isHolding) {
  //     requestAnimationFrame(() => {
  //       setPosition({ x: e.clientX, y: e.clientY })
  //     })
  //   }
  // }

  useEventListener('mousedown', handleMouseDown, { target: ref })
  useEventListener('mouseup', handleMouseUp, { target: ref })
  // useEventListener('mousemove', handleMouseMove, { target: ref })

  useEffect(() => {
    return () => {
      if (holdTimer.current) {
        clearTimeout(holdTimer.current)
        holdTimer.current = undefined
      }
    }
  }, [])

  return (
    <div className="absolute inset-0 cursor-pointer" ref={ref}>
      {showSpinner && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: position.x, top: position.y }}
        >
          <LoadingSpinner
            size={80}
            gapSize={0.6}
            segments={8}
            segmentType="arc"
            initiallyAnimating={false}
            state={isHolding}
          />
          <div className="h-20 w-20"></div>
          {/* <section>
            <div className="">projects</div>
            <div className="">talks</div>
          </section> */}
        </div>
      )}
    </div>
  )
}
