import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import vm from 'node:vm'
import nunjucks from 'nunjucks'

const root = new URL('../_site/', import.meta.url).pathname
const includesRoot = new URL('../src/_includes/', import.meta.url).pathname
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

function countOccurrences(value, needle) {
  return value.split(needle).length - 1
}

function inlineScript(html, marker) {
  return html.match(new RegExp(`<script[^>]*${marker}[^>]*>([\\s\\S]*?)<\\/script>`, 'i'))?.[1]
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
  const bytes = readFileSync(file)
  const html = bytes.toString('utf8')
  const page = `/${relative(root, file).replace(/\\/g, '/')}`
  const isAuditedPage = expectedRoutes.some((route) => routeToFile(route) === file)

  const charsetPosition = bytes.indexOf(Buffer.from('<meta charset="UTF-8">'))
  assert(
    charsetPosition >= 0 && charsetPosition < 1024,
    `${page}: UTF-8 charset declared within first 1,024 bytes`
  )

  for (const marker of ['â', 'Â', '�']) {
    assert(!html.includes(marker), `${page}: no mojibake marker ${JSON.stringify(marker)}`)
  }

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
    const isMetaTrackingPixel = src?.startsWith('https://www.facebook.com/tr?')
    if (isMetaTrackingPixel) {
      assert(alt === '', `${page}: Meta tracking pixel has empty alt`)
    } else {
      assert(alt !== undefined && alt.trim().length > 0, `${page}: image has meaningful alt (${src || 'unknown src'})`)
    }

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
assert(/href="tel:\+\d{10,15}"/.test(baseHtml), 'phone number is tel: link')

const metadataEnvironment = nunjucks.configure(includesRoot, { autoescape: true })
const metadataFixture = {
  title: 'Metadata Fixture',
  description: 'Fixture-specific metadata description used only by the automated P1-T2 audit.',
  ogImage: '/img/metadata-fixture.webp',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  page: { url: '/__fixtures__/social-metadata/' },
  content: '<h1>Metadata fixture</h1>'
}
const metadataFixtureHtml = metadataEnvironment.render('layouts/base.njk', metadataFixture)
assert(
  metadataFixtureHtml.includes(`<meta name="description" content="${metadataFixture.description}">`),
  'metadata fixture renders its own description'
)
assert(
  metadataFixtureHtml.includes(`<meta property="og:description" content="${metadataFixture.description}">`),
  'metadata fixture renders its own Open Graph description'
)
assert(
  metadataFixtureHtml.includes('<link rel="canonical" href="https://nakedtech.au/__fixtures__/social-metadata/">'),
  'metadata fixture preserves canonical URL rendering'
)
assert(
  metadataFixtureHtml.includes(`<meta property="og:image" content="https://nakedtech.au${metadataFixture.ogImage}">`),
  'metadata fixture renders its own Open Graph image'
)
assert(
  metadataFixtureHtml.includes(`<meta property="og:image:width" content="${metadataFixture.ogImageWidth}">`),
  'metadata fixture renders its own Open Graph image width'
)
assert(
  metadataFixtureHtml.includes(`<meta property="og:image:height" content="${metadataFixture.ogImageHeight}">`),
  'metadata fixture renders its own Open Graph image height'
)
assert(
  metadataFixtureHtml.includes(`<meta name="twitter:image" content="https://nakedtech.au${metadataFixture.ogImage}">`),
  'metadata fixture reuses its Open Graph image for Twitter'
)

const defaultMetadataHtml = metadataEnvironment.render('layouts/base.njk', {
  title: 'Default Metadata Fixture',
  page: { url: '/__fixtures__/default-metadata/' },
  content: '<h1>Default metadata fixture</h1>'
})
assert(
  defaultMetadataHtml.includes('<meta property="og:image" content="https://nakedtech.au/img/nakedtech_hero_technician.webp">'),
  'base metadata preserves the default Open Graph image'
)
assert(
  defaultMetadataHtml.includes('<meta property="og:image:width" content="1408">'),
  'base metadata preserves the default Open Graph image width'
)
assert(
  defaultMetadataHtml.includes('<meta property="og:image:height" content="768">'),
  'base metadata preserves the default Open Graph image height'
)
assert(
  defaultMetadataHtml.includes('<meta name="twitter:image" content="https://nakedtech.au/img/nakedtech_hero_technician.webp">'),
  'base metadata preserves the default Twitter image'
)

const contactComponentPath = join(includesRoot, 'components', 'contact-form.njk')
assert(existsSync(contactComponentPath), 'shared contact-form component exists')

if (existsSync(contactComponentPath)) {
  const componentTemplate = [
    '{% from "components/contact-form.njk" import contactForm %}',
    '{{ contactForm(formProps) }}'
  ].join('\n')
  const formProps = {
    heading: 'Fixture enquiry heading',
    introduction: 'Fixture introduction for the non-public landing-page component audit.',
    painPoint: 'wifi_dropouts'
  }
  const componentHtml = metadataEnvironment.renderString(componentTemplate, { formProps })
  const landingFixtureHtml = metadataEnvironment.render('layouts/base.njk', {
    title: 'Contact Form Fixture',
    description: 'Non-public fixture for the shared contact-form component and analytics context.',
    page: { url: '/__fixtures__/contact-form/' },
    landing: { id: formProps.painPoint },
    content: componentHtml
  })

  assert(componentHtml.includes(formProps.heading), 'contact-form fixture renders its page-provided heading')
  assert(componentHtml.includes(formProps.introduction), 'contact-form fixture renders its page-provided introduction')
  assert(componentHtml.includes(`data-pain-point="${formProps.painPoint}"`), 'contact-form fixture renders its pain-point context')
  assert(componentHtml.includes('https://forms.digitalsanctum.com.au/f/nakedtech-contact'), 'contact-form fixture renders the live Sanctum Forms endpoint')
  assert(landingFixtureHtml.includes(`data-pain-point="${formProps.painPoint}"`), 'in-memory landing fixture exposes its pain-point context')

  const componentScript = inlineScript(componentHtml, 'data-contact-form-tracking')
  assert(Boolean(componentScript), 'contact-form component renders one marked integration script')

  if (componentScript) {
    const messageHandlers = []
    const fbqCalls = []
    const gtagCalls = []
    const contextMessages = []
    const iframeWindow = {
      postMessage(message, targetOrigin) {
        contextMessages.push({ message, targetOrigin })
      }
    }
    const iframe = { contentWindow: iframeWindow, style: {} }
    const rootElement = {
      dataset: { painPoint: formProps.painPoint },
      querySelector(selector) {
        return selector === '[data-contact-form-frame]' ? iframe : null
      }
    }
    const windowObject = {
      location: {
        pathname: '/__fixtures__/contact-form/',
        search: '?utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01&utm_content=wifi_dropouts_v1&utm_term=ignored&unknown=ignored'
      },
      addEventListener(type, handler) {
        if (type === 'message') messageHandlers.push(handler)
      }
    }
    const documentObject = {
      currentScript: { previousElementSibling: rootElement }
    }

    vm.runInNewContext(componentScript, {
      window: windowObject,
      document: documentObject,
      URLSearchParams,
      fbq: (...args) => fbqCalls.push(args),
      gtag: (...args) => gtagCalls.push(args)
    })

    assert(messageHandlers.length === 1, 'contact-form component owns exactly one message handler')
    if (messageHandlers.length === 1) {
      const dispatch = (data, origin = 'https://forms.digitalsanctum.com.au', source = iframeWindow) => {
        messageHandlers[0]({ data, origin, source })
      }

      dispatch({ type: 'sanctum-forms:ready', version: 1 })
      dispatch({ type: 'sanctum-forms:ready', version: 1 })
      assert(contextMessages.length === 1, 'trusted ready sends exactly one attribution context message')
      assert(contextMessages[0]?.targetOrigin === 'https://forms.digitalsanctum.com.au', 'context targets the exact Forms origin')
      assert(contextMessages[0]?.message?.type === 'sanctum-forms:context', 'ready handshake sends the versioned context message type')
      assert(contextMessages[0]?.message?.version === 1, 'ready handshake sends protocol version 1')
      const sentContext = contextMessages[0]?.message?.context || {}
      assert(sentContext.pain_point === formProps.painPoint, 'landing context includes page pain point')
      assert(sentContext.page_path === '/__fixtures__/contact-form/', 'landing context includes pathname only')
      assert(sentContext.utm_source === 'facebook', 'landing context includes approved utm_source')
      assert(sentContext.utm_medium === 'paid_social', 'landing context includes approved utm_medium')
      assert(sentContext.utm_campaign === 'naked_tech_pain_points_01', 'landing context includes approved utm_campaign')
      assert(sentContext.utm_content === 'wifi_dropouts_v1', 'landing context includes approved utm_content')
      assert(!Object.hasOwn(sentContext, 'utm_term'), 'landing context excludes unapproved UTM keys')
      assert(!Object.hasOwn(sentContext, 'unknown'), 'landing context excludes arbitrary query-string keys')

      dispatch({ type: 'sanctum-forms:started', version: 1 }, 'https://attacker.example')
      dispatch({ type: 'sanctum-forms:started', version: 1 }, 'https://forms.digitalsanctum.com.au', {})
      dispatch({ type: 'sanctum-forms:started', version: 1 })
      dispatch({ type: 'sanctum-forms:started', version: 1 })
      const gaStartCalls = gtagCalls.filter((call) => call[0] === 'event' && call[1] === 'form_start')
      const metaStartCalls = fbqCalls.filter((call) => call[1] === 'form_start')
      assert(gaStartCalls.length === 1, 'trusted repeated started messages produce exactly one GA4 form_start')
      assert(gaStartCalls[0]?.[2]?.pain_point === formProps.painPoint, 'GA4 form_start includes pain-point context')
      assert(gaStartCalls[0]?.[2]?.page_path === '/__fixtures__/contact-form/', 'GA4 form_start includes page-path context')
      assert(metaStartCalls.length === 0, 'Meta receives no form-start event')

      dispatch({ type: 'sanctum-forms:resize', version: 1, height: 720 })
      assert(iframe.style.height === '720px', 'trusted finite positive resize message updates iframe height')

      dispatch({ type: 'sanctum-forms:resize', version: 1, height: 900 }, 'https://attacker.example')
      assert(iframe.style.height === '720px', 'wrong-origin resize message is rejected')

      dispatch({ type: 'sanctum-forms:resize', version: 1, height: 900 }, 'https://forms.digitalsanctum.com.au', {})
      assert(iframe.style.height === '720px', 'wrong-source resize message is rejected')

      dispatch({ type: 'sanctum-forms:resize', version: 1, height: '900' })
      assert(iframe.style.height === '720px', 'non-numeric resize height is rejected')

      const arrayMessage = []
      arrayMessage.type = 'sanctum-forms:resize'
      arrayMessage.version = 1
      arrayMessage.height = 900
      dispatch(arrayMessage)
      assert(iframe.style.height === '720px', 'non-plain-object message shape is rejected')

      dispatch({ type: 'sanctum-forms:submitted', version: 1 }, 'https://attacker.example')
      dispatch({ type: 'sanctum-forms:submitted', version: 1 })
      dispatch({ type: 'sanctum-forms:submitted', version: 1 })

      const metaLeadCalls = fbqCalls.filter((call) => call[0] === 'track' && call[1] === 'Lead')
      const gaLeadCalls = gtagCalls.filter((call) => call[0] === 'event' && call[1] === 'generate_lead')
      assert(metaLeadCalls.length === 1, 'one trusted repeated submission produces exactly one Meta Lead')
      assert(gaLeadCalls.length === 1, 'one trusted repeated submission produces exactly one GA4 generate_lead')
      assert(metaLeadCalls[0]?.[2]?.pain_point === formProps.painPoint, 'Meta Lead includes pain-point context')
      assert(metaLeadCalls[0]?.[2]?.page_path === '/__fixtures__/contact-form/', 'Meta Lead includes page-path context')
      assert(gaLeadCalls[0]?.[2]?.pain_point === formProps.painPoint, 'GA4 generate_lead includes pain-point context')
      assert(gaLeadCalls[0]?.[2]?.page_path === '/__fixtures__/contact-form/', 'GA4 generate_lead includes page-path context')
    }

    const genericHandlers = []
    const genericContexts = []
    const genericIframeWindow = {
      postMessage(message, targetOrigin) {
        genericContexts.push({ message, targetOrigin })
      }
    }
    const genericRoot = {
      dataset: { painPoint: '' },
      querySelector(selector) {
        return selector === '[data-contact-form-frame]'
          ? { contentWindow: genericIframeWindow, style: {} }
          : null
      }
    }
    vm.runInNewContext(componentScript, {
      window: {
        location: { pathname: '/contact/', search: '?utm_source=facebook&utm_term=ignored' },
        addEventListener(type, handler) {
          if (type === 'message') genericHandlers.push(handler)
        }
      },
      document: { currentScript: { previousElementSibling: genericRoot } },
      URLSearchParams,
      fbq: () => {},
      gtag: () => {}
    })
    genericHandlers[0]?.({
      data: { type: 'sanctum-forms:ready', version: 1 },
      origin: 'https://forms.digitalsanctum.com.au',
      source: genericIframeWindow
    })
    const genericContext = genericContexts[0]?.message?.context || {}
    assert(genericContext.page_path === '/contact/', 'generic contact context includes page path')
    assert(!Object.hasOwn(genericContext, 'pain_point'), 'generic contact context omits pain_point')
    assert(!Object.hasOwn(genericContext, 'utm_term'), 'generic contact context excludes unapproved UTM keys')
  }
}

const contactHtml = readFileSync(routeToFile('/contact/'), 'utf8')
assert(countOccurrences(contactHtml, 'data-contact-form-root') === 1, '/contact/: shared contact-form component renders once')
assert(countOccurrences(contactHtml, 'data-contact-form-tracking') === 1, '/contact/: shared form integration script renders once')
assert(countOccurrences(contactHtml, "addEventListener('message'") === 1, '/contact/: exactly one form message listener remains')
assert(countOccurrences(contactHtml, 'data-phone-click-tracking') === 1, '/contact/: sitewide phone tracking handler renders once')

const phoneTrackingScript = inlineScript(baseHtml, 'data-phone-click-tracking')
assert(Boolean(phoneTrackingScript), 'base layout renders the sitewide phone tracking script')

if (phoneTrackingScript) {
  const clickHandlers = []
  const fbqCalls = []
  const gtagCalls = []
  const phoneLink = { href: 'tel:+61370685422' }
  const documentObject = {
    body: { dataset: { painPoint: 'wifi_dropouts' } },
    addEventListener(type, handler) {
      if (type === 'click') clickHandlers.push(handler)
    }
  }

  vm.runInNewContext(phoneTrackingScript, {
    window: { location: { pathname: '/wifi-dropouts-ivanhoe/' } },
    document: documentObject,
    fbq: (...args) => fbqCalls.push(args),
    gtag: (...args) => gtagCalls.push(args)
  })

  assert(clickHandlers.length === 1, 'base layout owns exactly one delegated phone-click handler')
  if (clickHandlers.length === 1) {
    clickHandlers[0]({ target: { closest: () => phoneLink } })
    clickHandlers[0]({ target: { closest: () => null } })
    const metaContactCalls = fbqCalls.filter((call) => call[0] === 'track' && call[1] === 'Contact')
    const gaPhoneCalls = gtagCalls.filter((call) => call[0] === 'event' && call[1] === 'phone_click')
    assert(metaContactCalls.length === 1, 'one telephone activation produces exactly one Meta Contact')
    assert(gaPhoneCalls.length === 1, 'one telephone activation produces exactly one GA4 phone_click')
    assert(metaContactCalls[0]?.[2]?.pain_point === 'wifi_dropouts', 'Meta Contact includes page pain-point context')
    assert(metaContactCalls[0]?.[2]?.page_path === '/wifi-dropouts-ivanhoe/', 'Meta Contact includes page-path context')
    assert(gaPhoneCalls[0]?.[2]?.pain_point === 'wifi_dropouts', 'GA4 phone_click includes page pain-point context')
    assert(gaPhoneCalls[0]?.[2]?.page_path === '/wifi-dropouts-ivanhoe/', 'GA4 phone_click includes page-path context')
  }
}

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  console.error(`\n${passes.length} checks passed before failure.`)
  process.exit(1)
}

console.log(`Site audit passed: ${passes.length} checks across ${htmlFiles.length} generated pages.`)
