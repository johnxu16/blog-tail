'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { TextureLoader, Vector2, type Mesh } from 'three'

export interface GlobeHotspot {
  slug: string
  name: string
  description: string
  postCount: number
}

export interface GlobeSceneProps {
  hotspots: GlobeHotspot[]
}

const SPHERE_RADIUS = 2.4
const RING_RADIUS = 3.2

function Cat({ directionRef }: { directionRef: React.MutableRefObject<number> }) {
  const mesh = useRef<Mesh>(null)

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    // Wobble: cat hops a little
    mesh.current.position.y = Math.sin(t * 2) * 0.04
    // Face the last pointer direction (or default south)
    mesh.current.rotation.y = -directionRef.current
  })

  return (
    <mesh ref={mesh} position={[0, 0.05, SPHERE_RADIUS + 0.1]}>
      <planeGeometry args={[0.55, 0.55]} />
      <meshBasicMaterial color="#f7c08a" />
    </mesh>
  )
}

function Hotspot({
  angle,
  hotspot,
  onSelect,
}: {
  angle: number
  hotspot: GlobeHotspot
  onSelect: (slug: string) => void
}) {
  const mesh = useRef<Mesh>(null)
  const x = Math.cos(angle) * RING_RADIUS
  const z = Math.sin(angle) * RING_RADIUS
  const [hover, setHover] = useState(false)

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.getElapsedTime()
    mesh.current.position.y = Math.sin(t * 1.5 + angle) * 0.08
  })

  return (
    <mesh
      ref={mesh}
      position={[x, 0, z]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => onSelect(hotspot.slug)}
    >
      <planeGeometry args={[hover ? 0.7 : 0.55, hover ? 0.7 : 0.55]} />
      <meshBasicMaterial color={hover ? '#fbbf24' : '#a78bfa'} />
    </mesh>
  )
}

function Planet() {
  const { camera } = useThree()
  const mesh = useRef<Mesh>(null)
  const [texture, setTexture] = useState<ReturnType<typeof TextureLoader.prototype.load> | null>(
    null
  )
  const textureError = useRef(false)

  useEffect(() => {
    if (textureError.current) return
    const loader = new TextureLoader()
    loader.load(
      '/static/sprites/planet.png',
      (t) => setTexture(t),
      undefined,
      () => {
        textureError.current = true
      }
    )
  }, [])

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.0008
    }
    camera.lookAt(0, 0, 0)
  })

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[SPHERE_RADIUS, 48, 48]} />
      {texture ? <meshBasicMaterial map={texture} /> : <meshBasicMaterial color="#3b6e8f" />}
    </mesh>
  )
}

function PointerTracker({
  pointerRef,
}: {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>
}) {
  const { size } = useThree()
  useEffect(() => {
    pointerRef.current = { x: size.width / 2, y: size.height / 2 }
  }, [size, pointerRef])
  return null
}

export default function GlobeScene({ hotspots }: GlobeSceneProps) {
  const directionRef = useRef<number>(0)
  const pointerRef = useRef<{ x: number; y: number; lastAngle: number }>({
    x: 0,
    y: 0,
    lastAngle: 0,
  })

  const hotspotsWithAngles = useMemo(() => {
    const step = (Math.PI * 2) / Math.max(hotspots.length, 1)
    return hotspots.map((h, i) => ({ ...h, angle: i * step - Math.PI / 2 }))
  }, [hotspots])

  return (
    <div
      className="relative aspect-square w-full max-w-2xl"
      style={{ imageRendering: 'pixelated' }}
      onPointerMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        const angle = Math.atan2(y, x)
        directionRef.current = angle
        pointerRef.current.lastAngle = angle
      }}
    >
      <Canvas
        camera={{ position: [0, 1.6, 6.4], fov: 50 }}
        gl={{ antialias: false }}
        style={{ imageRendering: 'pixelated' }}
        dpr={[1, 1]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Planet />
        <Cat directionRef={directionRef} />
        {hotspotsWithAngles.map((h) => (
          <Hotspot
            key={h.slug}
            angle={h.angle}
            hotspot={h}
            onSelect={(slug) => {
              if (typeof window !== 'undefined') {
                window.location.href = `/tags/${slug}`
              }
            }}
          />
        ))}
      </Canvas>
    </div>
  )
}
