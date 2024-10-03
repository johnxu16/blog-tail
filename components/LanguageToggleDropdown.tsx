'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  // { code: 'es', name: 'Español', flag: '🇪🇸' },
  // { code: 'fr', name: 'Français', flag: '🇫🇷' },
  // { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  // { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  // { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export default function LanguageToggleDropdown() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-40 justify-between p-0 font-normal">
          <span className="flex items-center">
            {selectedLanguage.flag}
            <span className="ml-2">{selectedLanguage.name}</span>
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setSelectedLanguage(language)}
            className="justify-between"
          >
            <span className="flex items-center">
              {language.flag}
              <span className="ml-2">{language.name}</span>
            </span>
            {language.code === selectedLanguage.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
