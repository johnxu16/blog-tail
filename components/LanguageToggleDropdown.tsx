import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'app/i18n'
import { languages } from 'app/i18n/settings'
import Link from 'next/link'

export default async function LanguageToggleDropdown({ lang }: { lang: string }) {
  const { t } = await useTranslation(lang, 'lang')

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
      <DropdownMenuContent className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem key={language} className="cursor-pointer justify-between">
            <Link className="flex items-center" href={`/${language}`}>
              {t(language)}
            </Link>
            {language === lang && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
