import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const root = new URL('../_site/', import.meta.url).pathname
const failures = []
const passes = []

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? walk(path) : [path]
  })
}

function routeToFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\/+/, '')
  if (!clean) return join(root, 'index.html')
  if (extname(clean)) return join(root, clean)
  return join(root, clean, 'index.html')
}

function assert(condition, message) {
  if (condition) passes.push(message)
  else failures.push(message)
}

const expectedRoutes = [
  '/',
  '/services/',
  '/services/full-strip/',
  '/services/bodyguard/',
  '/services/power-pose/',
  '/services/quickie/',
  '/booking/',
  '/contact/',
  '/brand/',
  '/toolkit/',
  '/join/',
  '/legal/',
  '/privacy/',
  '/thank-you/'
]

const robotsPath = join(root, 'robots.txt')
assert(existsSync(robotsPath), 'robots.txt exists')
assert(existsSync(join(root, 'sitemap.xml')), 'sitemap.xml exists')
if (existsSync(robotsPath)) {
  assert(readFileSync(robotsPath, 'utf8').includes('https://nakedtech.au/sitemap.xml'), 'robots.txt advertises sitemap')
}

for (const route of expectedRoutes) {
  assert(existsSync(routeToFile(route)), `route exists: ${route}`)
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'))
assert(htmlFiles.length >= expectedRoutes.length, `generated at least ${expectedRoutes.length} HTML pages`)

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8')
  const page = `/${relative(root, file).replace(/\\/g, '/')}`
  const isAuditedPage = expectedRoutes.some((route) => routeToFile(route) === file)

  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
  const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1]?.trim()
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]?.trim()

  if (isAuditedPage) {
    assert(Boolean(title && title.length > 5), `${page}: descriptive title present`)
    assert(Boolean(description && description.length >= 50), `${page}: meta description present`)
    assert(Boolean(canonical?.startsWith('https://nakedtech.au/')), `${page}: canonical URL present`)

    const h1Count = (html.match(/<h1\b/gi) || []).length
    assert(h1Count === 1, `${page}: exactly one h1`)
  }

  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const href = match[1]
    if (href === '#') failures.push(`${page}: placeholder href="#"`)
    if (/^(?:https?:|mailto:|tel:|#)/i.test(href)) continue

    const target = new URL(href, 'https://nakedtech.au/')
    assert(existsSync(routeToFile(target.pathname)), `${page}: internal link resolves (${href})`)
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attributes = match[1]
    const src = attributes.match(/\bsrc=["']([^"']+)["']/i)?.[1]
    const alt = attributes.match(/\balt=["']([^"']*)["']/i)?.[1]
    assert(alt !== undefined && alt.trim().length > 0, `${page}: image has meaningful alt (${src || 'unknown src'})`)

    if (src?.startsWith('/')) {
      const assetPath = join(root, src.split(/[?#]/)[0].replace(/^\/+/, ''))
      assert(existsSync(assetPath), `${page}: image asset exists (${src})`)
    }
  }

  for (const match of html.matchAll(/<a\b([^>]*)target=["']_blank["']([^>]*)>/gi)) {
    const attributes = `${match[1]} ${match[2]}`
    assert(/\brel=["'][^"']*noopener/i.test(attributes), `${page}: external new-tab link uses rel="noopener"`)
  }
}

for (const slug of ['full-strip', 'bodyguard', 'power-pose', 'quickie']) {
  const file = routeToFile(`/services/${slug}/`)
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf8')
  for (const sectionId of ['included', 'process', 'faq']) {
    assert(html.includes(`id="${sectionId}"`), `${slug}: #${sectionId} section rendered`)
  }
  assert(html.includes('Hardware sold at cost. No markups.'), `${slug}: transparent hardware policy rendered`)
  assert(html.includes('href="/contact/"'), `${slug}: contact CTA rendered`)
}

const baseHtml = readFileSync(join(root, 'index.html'), 'utf8')
assert(baseHtml.includes('03 7068 5422'), 'phone number present in header/nav')
assert(baseHtml.includes('href="tel:+61370685422"'), 'phone number is tel: link')

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  console.error(`\n${passes.length} checks passed before failure.`)
  process.exit(1)
}

console.log(`Site audit passed: ${passes.length} checks across ${htmlFiles.length} generated pages.`)
