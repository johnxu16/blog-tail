'use client'

import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

const languages = [
  { code: 'cn', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  // { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  // { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export default function LanguageToggleDropdown({ lang }: { lang: string }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-24 justify-between border-none px-2 text-center font-normal"
        >
          <span className="flex-1 items-center justify-center text-ellipsis">
            {lang}
            {/* <span>{selectedLanguage.name}</span> */}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            // onClick={() => handleLanguageChange(language)}
            className="cursor-pointer justify-between"
          >
            <Link className="flex items-center" href={`/${language.code}`}>
              {language.flag}
              <span className="ml-2">{language.name}</span>
            </Link>
            {/* <span className="flex items-center">
              {language.flag}
              <span className="ml-2">{language.name}</span>
            </span> */}
            {language.code === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
