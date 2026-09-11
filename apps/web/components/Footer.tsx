import Link from './Link'
import site from '@blog/config/site'
import SocialIcon from '@/components/social-icons'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={site.email ? `mailto:${site.email}` : undefined} size={6} />
          <SocialIcon kind="github" href={site.github} size={6} />
          <SocialIcon kind="x" href="https://twitter.com/x" size={6} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{site.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>
            <a target="_blank" rel="noopener noreferrer" href="https://beian.miit.gov.cn/">
              浙ICP备2021035971号
            </a>
          </div>
          <div>{` • `}</div>
          <Link href="/">{site.title}</Link>
        </div>
      </div>
    </footer>
  )
}
