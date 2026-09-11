'use client'

import { ThemeProvider } from 'next-themes'
import site from '@blog/config/site'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={site.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
