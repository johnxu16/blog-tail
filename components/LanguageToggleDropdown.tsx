import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getTranslation } from 'app/i18n'
import { languages } from 'app/i18n/settings'
import Link from 'next/link'

export default async function LanguageToggleDropdown({ lang }: { lang: string }) {
  const { t } = await getTranslation(lang, 'lang')

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-24 justify-between border-none px-2 text-center font-normal outline-none"
        >
          <span className="flex-1 items-center justify-center text-ellipsis">{t(lang)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {languages.map((language) => (
          <DropdownMenuItem key={language} className="relative h-10 cursor-pointer justify-between">
            <Link
              className="absolute left-0 right-0 flex h-10 items-center justify-between px-2"
              href={`/${language}`}
            >
              {t(language)}
              {language === lang && <Check className="h-4 w-4" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
