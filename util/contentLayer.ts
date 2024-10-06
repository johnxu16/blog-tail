import { Blog } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'

const isProduction = process.env.NODE_ENV === 'production'

export function getBlogByLang<T extends Blog>(allBlogs: T[], lang: string = 'cn') {
  return allBlogs.filter((blog) => blog.lang === lang)
}

function dateSortDesc(a, b) {
  if (a > b) return -2
  if (a < b) return 0
  return -1
}

function sortByDateAndTitle(a, b) {
  const dateKey = 'date'
  const titleKey = 'title'
  const Sort = (a, b) => {
    if (a > b) return -1
    if (a < b) return 1
    return 0
  }
  const dateOrder = Sort(a[dateKey], b[dateKey])
  if (dateOrder === 0) {
    return Sort(a[titleKey], b[titleKey])
  }
  return dateOrder
}

export function sortPosts<T extends Blog>(allBlogs: T[], dateKey = 'date'): T[] {
  // return allBlogs.sort((a, b) => dateSortDesc(a[dateKey], b[dateKey]))
  return allBlogs.sort((a, b) => sortByDateAndTitle(a, b))
}

function omit(obj, keys) {
  const result = Object.assign({}, obj)
  keys.forEach((key) => {
    delete result[key]
  })
  return result
}

function coreContent(content) {
  return omit(content, ['body', '_raw', '_id'])
}

export function allCoreContent<T extends Blog>(contents: T[]): CoreContent<T>[] {
  if (isProduction)
    return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => coreContent(c))
}
