import { CSSProperties, ReactNode } from 'react'

export interface GlassProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  blur?: number
  saturation?: number
  bgTint?: string
}

export function Glass({
  children,
  className = '',
  style,
  blur = 14,
  saturation = 140,
  bgTint = 'rgba(255,255,255,0.55)',
}: GlassProps) {
  const supportedStyle: CSSProperties = {
    background: bgTint,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)',
    ...style,
  }
  const fallbackStyle: CSSProperties = {
    background: bgTint,
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: '0.75rem',
    boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)',
    ...style,
  }

  return (
    <>
      <div className={`glass glass-supported ${className}`} style={supportedStyle}>
        {children}
      </div>
      <style>{`
        @supports not ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))) {
          .glass-supported { display: none; }
        }
      `}</style>
      <noscript>
        <div className={`glass-fallback ${className}`} style={fallbackStyle}>
          {children}
        </div>
      </noscript>
    </>
  )
}
