'use client'

import { useEventListener } from 'ahooks'

interface VimMenuProps {
  items: MenuItem[]
}

interface MenuItem {
  label: string
  href?: string
  selected?: boolean
}

export default function VimMenu(props: VimMenuProps) {
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // better with popup
      // old tv blackout screen with light at the middle and close the page
      console.log('Escape key pressed')
    } else if (e.key === 'j') {
      console.log('ArrowUp key pressed')
    } else if (e.key === 'k') {
      console.log('ArrowDown key pressed')
    } else if (e.key === 'ArrowUp') {
      console.log('ArrowUp key pressed')
    } else if (e.key === 'ArrowDown') {
      console.log('ArrowDown key pressed')
    }
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {props.items.map((item) => (
        <span key={item.label}>{item.label}</span>
      ))}
    </div>
  )
}
