import site from '@blog/config/site'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import Image from 'next/image'

const Header = () => {
  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={site.title}>
          <div className="flex items-center justify-between">
            <div className="relative mr-3 size-16 shrink-0 overflow-hidden rounded-full border border-transparent shadow-sm">
              <Image src="/static/images/avatar.jpg" alt="logo" fill sizes="64px" />
            </div>
            <span className="ml-3 hidden text-3xl font-medium text-gray-900 sm:block dark:text-gray-100">
              {site.author}
            </span>
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 sm:block dark:text-gray-100"
            >
              {link.title}
            </Link>
          ))}
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
