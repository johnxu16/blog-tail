'use client'

import { ReactNode } from 'react'

// Define the available segment types
export type SegmentType = 'arc' | 'circle' | 'line' | 'rounded-rect' | 'triangle'

interface LoadingSpinnerProps {
  size?: number
  segments?: number
  speed?: number
  colorStart?: string
  colorEnd?: string
  initiallyAnimating?: boolean
  state?: boolean
  gapSize?: number
  segmentType?: SegmentType
  segmentSize?: number
}

export default function LoadingSpinner({
  size = 120,
  segments = 12,
  speed = 1,
  colorStart = '#000000',
  colorEnd = '#e5e5e5',
  initiallyAnimating = true,
  state = undefined,
  gapSize = 0.2,
  segmentType = 'arc',
  segmentSize = 10,
}: LoadingSpinnerProps) {
  const strokeWidth = size * (segmentSize / 100)
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const segmentAngle = (2 * Math.PI) / segments

  // Generate segments based on the selected type
  const renderSegments = () => {
    const segmentArray: ReactNode[] = []

    for (let i = 0; i < segments; i++) {
      const angle = i * segmentAngle
      const colorRatio = i / segments
      const color = interpolateColor(colorStart, colorEnd, colorRatio)

      switch (segmentType) {
        case 'arc':
          segmentArray.push(renderArcSegment(i, angle, color))
          break
        case 'circle':
          segmentArray.push(renderCircleSegment(i, angle, color))
          break
        case 'line':
          segmentArray.push(renderLineSegment(i, angle, color))
          break
        case 'rounded-rect':
          segmentArray.push(renderRoundedRectSegment(i, angle, color))
          break
        case 'triangle':
          segmentArray.push(renderTriangleSegment(i, angle, color))
          break
        default:
          segmentArray.push(renderArcSegment(i, angle, color))
      }
    }

    return segmentArray
  }

  // Render an arc segment (original style)
  const renderArcSegment = (index: number, angle: number, color: string) => {
    // https://stackoverflow.com/questions/9389315/cross-browser-javascript-number-precision
    const precise = (n: number) => Number.parseFloat(n.toFixed(13))

    const startX = precise(center + radius * Math.cos(angle))
    const startY = precise(center + radius * Math.sin(angle))
    const endX = precise(center + radius * Math.cos(angle + segmentAngle * (1 - gapSize)))
    const endY = precise(center + radius * Math.sin(angle + segmentAngle * (1 - gapSize)))

    // Create arc path
    const largeArcFlag = 0 // 0 for arc < 180 degrees
    const sweepFlag = 1 // 1 for clockwise

    const path = [
      `M ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`,
    ].join(' ')

    return (
      <path
        key={`arc-${index}`}
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    )
  }

  // Render a circle segment
  const renderCircleSegment = (index: number, angle: number, color: string) => {
    const circleRadius = strokeWidth / 2
    const distance = radius
    const x = center + distance * Math.cos(angle + segmentAngle * 0.5)
    const y = center + distance * Math.sin(angle + segmentAngle * 0.5)

    return (
      <circle
        key={`circle-${index}`}
        cx={x}
        cy={y}
        r={circleRadius * (1 + (1 - gapSize))}
        fill={color}
      />
    )
  }

  // Render a line segment
  const renderLineSegment = (index: number, angle: number, color: string) => {
    const innerRadius = radius * 0.7
    const outerRadius = radius * 1.1
    const x1 = center + innerRadius * Math.cos(angle + segmentAngle * 0.5)
    const y1 = center + innerRadius * Math.sin(angle + segmentAngle * 0.5)
    const x2 = center + outerRadius * Math.cos(angle + segmentAngle * 0.5)
    const y2 = center + outerRadius * Math.sin(angle + segmentAngle * 0.5)

    return (
      <line
        key={`line-${index}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth * (1 - gapSize * 0.5)}
        strokeLinecap="round"
      />
    )
  }

  // Render a rounded rectangle segment
  const renderRoundedRectSegment = (index: number, angle: number, color: string) => {
    const rectWidth = strokeWidth * 1.5 * (1 - gapSize * 0.5)
    const rectHeight = strokeWidth * 3 * (1 - gapSize * 0.5)
    const distance = radius * 0.9

    // Calculate center position of the rectangle
    const x = center + distance * Math.cos(angle + segmentAngle * 0.5)
    const y = center + distance * Math.sin(angle + segmentAngle * 0.5)

    // Calculate rotation transform
    const rotationAngle = (angle + segmentAngle * 0.5) * (180 / Math.PI) + 90

    return (
      <rect
        key={`rect-${index}`}
        x={x - rectWidth / 2}
        y={y - rectHeight / 2}
        width={rectWidth}
        height={rectHeight}
        rx={rectWidth / 2}
        ry={rectWidth / 2}
        fill={color}
        transform={`rotate(${rotationAngle} ${x} ${y})`}
      />
    )
  }

  // Render a triangle segment
  const renderTriangleSegment = (index: number, angle: number, color: string) => {
    const distance = radius * 0.9
    const triangleSize = strokeWidth * 2 * (1 - gapSize * 0.5)

    // Calculate the center position of the triangle
    const centerX = center + distance * Math.cos(angle + segmentAngle * 0.5)
    const centerY = center + distance * Math.sin(angle + segmentAngle * 0.5)

    // Calculate rotation angle
    const rotationAngle = (angle + segmentAngle * 0.5) * (180 / Math.PI) + 90

    // Calculate triangle points (equilateral triangle)
    const point1X = 0
    const point1Y = -triangleSize
    const point2X = -triangleSize * 0.866 // sin(60°)
    const point2Y = triangleSize * 0.5
    const point3X = triangleSize * 0.866 // sin(60°)
    const point3Y = triangleSize * 0.5

    const points = `${point1X},${point1Y} ${point2X},${point2Y} ${point3X},${point3Y}`

    return (
      <polygon
        key={`triangle-${index}`}
        points={points}
        fill={color}
        transform={`translate(${centerX} ${centerY}) rotate(${rotationAngle})`}
      />
    )
  }

  // Helper function to interpolate between two colors
  const interpolateColor = (color1: string, color2: string, factor: number) => {
    if (factor <= 0) return color1
    if (factor >= 1) return color2

    const r1 = Number.parseInt(color1.substring(1, 3), 16)
    const g1 = Number.parseInt(color1.substring(3, 5), 16)
    const b1 = Number.parseInt(color1.substring(5, 7), 16)

    const r2 = Number.parseInt(color2.substring(1, 3), 16)
    const g2 = Number.parseInt(color2.substring(3, 5), 16)
    const b2 = Number.parseInt(color2.substring(5, 7), 16)

    const r = Math.round(r1 + factor * (r2 - r1))
    const g = Math.round(g1 + factor * (g2 - g1))
    const b = Math.round(b1 + factor * (b2 - b1))

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  return (
    <div className="absolute flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          animation: `spin ${3 / speed}s linear infinite`,
          animationPlayState: (state ?? initiallyAnimating) ? 'running' : 'paused',
        }}
      >
        {renderSegments()}
      </svg>
    </div>
  )
}
