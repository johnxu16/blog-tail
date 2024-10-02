import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

let locales = ['cn', 'en']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
  return request.cookies.get('NEXT_LOCALE')?.value || 'cn'
}

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(request.nextUrl.pathname)
  ) {
    return
  }

  const { pathname } = request.nextUrl
  // console.log('current', request.nextUrl)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  // request.nextUrl.pathname = `/${locale}${pathname}`

  // console.log('next', request.nextUrl)

  return NextResponse.redirect(
    new URL(`/${locale}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url)
  )
  // return NextResponse.redirect(request.nextUrl)
}

// only applies this middleware to files in the app directory
// export const config = {
//   matcher: '/((?!api|static|.*\\..*|_next).*)'
// };
