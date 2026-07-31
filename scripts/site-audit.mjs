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

function documentTitle(html) {
  return html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim()
}

function metaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const name = tag.match(/\b(?:name|property)=(["'])(.*?)\1/i)?.[2]
    if (name !== key) continue
    return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim()
  }
  return undefined
}

function canonicalUrl(html) {
  return html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1]?.trim()
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => /\btype=["']application\/ld\+json["']/i.test(match[1]))
    .map((match) => match[2].trim())
}

const expectedRoutes = [
  '/',
  '/services/',
  '/services/full-strip/',
  '/services/bodyguard/',
  '/services/power-pose/',
  '/services/quickie/',
  '/services/wifi-dropouts-ivanhoe/',
  '/services/slow-computer-help-ivanhoe/',
  '/services/scam-security-help-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/printer-help-ivanhoe/',
  '/services/email-help-ivanhoe/',
  '/booking/',
  '/contact/',
  '/brand/',
  '/toolkit/',
  '/join/',
  '/legal/',
  '/privacy/',
  '/thank-you/'
]

// Register approved public pain-page routes here as they are created.
// The non-public template contract remains exercised by the in-memory fixture below.
const landingPageAudits = [
  {
    route: '/services/wifi-dropouts-ivanhoe/',
    title: 'Wi-Fi Dropout Diagnosis Ivanhoe &amp; Eaglemont | Naked Tech',
    description: 'Fixed-price Wi-Fi dropout diagnosis for Ivanhoe and Eaglemont homes, separating NBN, router, placement, interference and coverage problems.',
    canonical: 'https://nakedtech.au/services/wifi-dropouts-ivanhoe/',
    ogImage: 'https://nakedtech.au/img/services-hero.webp',
    painPoint: 'wifi_dropouts',
    primaryLabel: 'Book the $190 Wi-Fi diagnosis',
    primaryHref: '#contact',
    robots: 'index, follow',
    sitemap: 'present'
  },
  {
    route: '/services/slow-computer-help-ivanhoe/',
    title: 'Slow Computer Help Ivanhoe &amp; Eaglemont | Naked Tech',
    description: 'Fixed-price $190 onsite slow-computer assessment for Ivanhoe and Eaglemont, with Windows compatibility and a written fix, upgrade or replace plan.',
    canonical: 'https://nakedtech.au/services/slow-computer-help-ivanhoe/',
    ogImage: 'https://nakedtech.au/img/slow-computer-help-og.webp',
    painPoint: 'slow_computer',
    primaryLabel: 'Book the $190 performance assessment',
    primaryHref: '#contact',
    robots: 'index, follow',
    sitemap: 'present',
    contentMarkers: [
      '$190 fixed',
      '60–75 minute onsite assessment',
      'Written decision plan',
      '30+ years in technology and support',
      'workshop remediation'
    ]
  }
]

landingPageAudits.push({
  route: '/services/scam-security-help-ivanhoe/',
  title: 'Scam &amp; Account Security Help Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Calm $250 onsite scam and account-security assessment for Ivanhoe and Eaglemont, covering devices, browsers, exposed accounts and practical next steps.',
  canonical: 'https://nakedtech.au/services/scam-security-help-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/scam-security-help-og.webp',
  painPoint: 'scam_security',
  primaryLabel: 'Book the $250 assessment',
  primaryHref: '#contact',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$250 fixed',
    'up to 90 minutes onsite',
    'Scamwatch',
    'ReportCyber',
    'does not recover or guarantee recovery',
    'not a 24/7 emergency or incident-response service'
  ]
})

landingPageAudits.push({
  route: '/services/new-computer-setup-data-transfer-ivanhoe/',
  title: 'New Computer Setup &amp; Data Transfer Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $550 Windows 11 setup and data transfer in Ivanhoe and Eaglemont, including up to 250 GB from one working Windows computer.',
  canonical: 'https://nakedtech.au/services/new-computer-setup-data-transfer-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/new-computer-setup-og.webp',
  painPoint: 'new_computer_setup',
  variant: 'guided-service',
  visualImage: '/img/new-computer-setup-og.webp',
  visualHeading: 'Set up beside you, not taken away.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the Standard Windows Move fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$550 fixed',
    'GST-inclusive',
    'up to three hours',
    '250 GB',
    'one business day',
    'current usable backup',
    'no automatic hourly overrun',
    'password or provider-controlled account recovery',
    'Call Peter about your move',
    'Tell Peter about your new computer.',
    'CONTACT PETER'
  ]
})

landingPageAudits.push({
  route: '/services/printer-help-ivanhoe/',
  title: 'Printer Help Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $190 incl. GST onsite printer troubleshooting in Ivanhoe and Eaglemont for one existing printer and one primary device.',
  canonical: 'https://nakedtech.au/services/printer-help-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/printer-help-og.webp',
  painPoint: 'printer_help',
  variant: 'guided-service',
  visualImage: '/img/printer-help-og.webp',
  visualHeading: 'See the problem where it happens.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the printer visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$190 fixed incl. GST',
    'up to 60 minutes onsite',
    'one existing household printer',
    'one primary device',
    'not a guaranteed repair',
    'new-printer setup',
    'provider-controlled account recovery',
    'Monday to Friday',
    'no automatic hourly overrun',
    'Call Peter about your printer',
    'Tell Peter what your printer is doing.'
  ]
})

landingPageAudits.push({
  route: '/services/email-help-ivanhoe/',
  title: 'Email Help Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $190 incl. GST onsite personal email troubleshooting in Ivanhoe and Eaglemont for one existing account on one supported device.',
  canonical: 'https://nakedtech.au/services/email-help-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/email-help-og.webp',
  painPoint: 'email_help',
  variant: 'guided-service',
  visualImage: '/img/email-help-og.webp',
  visualHeading: 'Calm help, with you in control.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the email visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$190 fixed incl. GST',
    'up to 60 minutes onsite',
    'one existing personal email account',
    'not a guaranteed fix',
    'Password recovery',
    'provider-controlled identity decision',
    'not deleted or rebuilt',
    'Monday to Friday',
    'no automatic hourly overrun',
    'Call Peter about your email',
    'Tell Peter what your email is doing.'
  ]
})

const standardLandingSectionIds = [
  'offer',
  'symptoms',
  'diagnosis',
  'included',
  'process',
  'proof',
  'pricing',
  'faq',
  'contact'
]

const guidedLandingSectionIds = [
  'offer',
  'fit',
  'included',
  'process',
  'safety',
  'faq',
  'contact'
]

const guidedForbiddenSectionIds = [
  'symptoms',
  'diagnosis',
  'proof',
  'pricing'
]

function auditLandingPageHtml(audit, html, metadataEntries, sitemapXml) {
  const page = audit.route

  if (audit.robots) {
    assert(metaContent(html, 'robots') === audit.robots, `${page}: robots directive is ${audit.robots}`)
  }
  if (audit.sitemap === 'absent') {
    assert(!sitemapXml.includes(audit.canonical), `${page}: non-public fixture is absent from sitemap`)
  }
  if (audit.sitemap === 'present') {
    assert(countOccurrences(sitemapXml, audit.canonical) === 1, `${page}: public landing page appears exactly once in sitemap`)
  }

  assert((html.match(/<h1\b/gi) || []).length === 1, `${page}: exactly one h1`)

  const isGuidedService = audit.variant === 'guided-service'
  const requiredSectionIds = isGuidedService ? guidedLandingSectionIds : standardLandingSectionIds
  for (const sectionId of requiredSectionIds) {
    assert(countOccurrences(html, `id="${sectionId}"`) === 1, `${page}: exactly one #${sectionId} section rendered`)
  }
  if (isGuidedService) {
    for (const sectionId of guidedForbiddenSectionIds) {
      assert(countOccurrences(html, `id="${sectionId}"`) === 0, `${page}: compact guided service omits #${sectionId}`)
    }

    const offerSection = html.match(/<header\b[^>]*id=["']offer["'][\s\S]*?<\/header>/i)?.[0] || ''
    const phonePrimary = offerSection.match(/<a\b[^>]*data-hero-phone-primary[^>]*>/i)?.[0] || ''
    const formSecondary = offerSection.match(/<a\b[^>]*data-hero-form-secondary[^>]*>/i)?.[0] || ''
    assert(countOccurrences(offerSection, 'data-hero-phone-primary') === 1, `${page}: hero renders one phone-first action`)
    assert(countOccurrences(offerSection, 'data-hero-form-secondary') === 1, `${page}: hero renders one secondary enquiry action`)
    assert(offerSection.indexOf('data-hero-phone-primary') < offerSection.indexOf('data-hero-form-secondary'), `${page}: phone action precedes enquiry action in DOM order`)
    assert(/href=["']tel:\+\d{10,15}["']/i.test(phonePrimary), `${page}: primary hero action is a telephone link`)
    assert(/href=["']#contact["']/i.test(formSecondary), `${page}: secondary hero action targets the shared enquiry form`)
    assert(offerSection.includes('href="#fit"'), `${page}: offer card links to the fit comparison`)
    if (audit.detailLabel) {
      assert(offerSection.includes(audit.detailLabel), `${page}: guided offer card uses its problem-specific fit label`)
    }
    assert(!html.includes('href="#symptoms"'), `${page}: guided page has no dead symptoms anchor`)

    const fitSection = html.match(/<section\b[^>]*id=["']fit["'][\s\S]*?<\/section>/i)?.[0] || ''
    const goodFit = fitSection.match(/<article\b[^>]*data-fit-good[^>]*>[\s\S]*?<\/article>/i)?.[0] || ''
    const separateFit = fitSection.match(/<article\b[^>]*data-fit-not[^>]*>[\s\S]*?<\/article>/i)?.[0] || ''
    assert(countOccurrences(fitSection, 'data-fit-good') === 1, `${page}: fit comparison has one standard-scope list`)
    assert(countOccurrences(fitSection, 'data-fit-not') === 1, `${page}: fit comparison has one separate-scope list`)
    assert((goodFit.match(/<li\b/gi) || []).length > 0, `${page}: standard-scope fit list is non-empty`)
    assert((separateFit.match(/<li\b/gi) || []).length > 0, `${page}: separate-scope fit list is non-empty`)
    assert(!html.includes('aria-label="Telephone enquiry"'), `${page}: guided page omits the repeated lower telephone callout`)
  }

  const faqSection = html.match(/<section\b[^>]*id=["']faq["'][\s\S]*?<\/section>/i)?.[0] || ''
  const faqCount = (faqSection.match(/<details\b/gi) || []).length
  assert(faqCount >= 3 && faqCount <= 6, `${page}: FAQ count remains within the documented 3–6 range`)

  if (audit.visualImage) {
    assert(countOccurrences(html, `src="${audit.visualImage}"`) === 1, `${page}: visible service image renders exactly once`)
    assert(html.includes(audit.visualHeading), `${page}: visible service image has its approved supporting heading`)
  }

  assert(html.includes(`href="${audit.primaryHref}"`), `${page}: primary CTA target rendered`)
  assert(html.includes(audit.primaryLabel), `${page}: primary CTA label rendered`)
  assert(html.includes('href="#process"'), `${page}: contextual how-it-works nav targets local process`)
  for (const marker of audit.contentMarkers || []) {
    assert(html.includes(marker), `${page}: approved commercial marker rendered (${marker})`)
  }
  assert(/href=["']tel:\+\d{10,15}["']/i.test(html), `${page}: telephone link rendered`)
  assert(html.includes('<iframe'), `${page}: form iframe rendered`)
  assert((html.match(/<iframe\b[^>]*\bdata-contact-form-frame\b/gi) || []).length === 1, `${page}: exactly one shared form iframe rendered`)
  assert(countOccurrences(html, 'data-contact-form-tracking') === 1, `${page}: exactly one shared form integration script rendered`)
  const formSlug = audit.formSlug || 'nakedtech-contact'
  assert(html.includes(`https://forms.digitalsanctum.com.au/f/${formSlug}`), `${page}: approved Forms endpoint rendered`)
  if (isGuidedService) {
    assert(!html.includes('nakedtech-new-computer-move-suitability'), `${page}: detailed owner-operated checklist is not exposed on the public page`)
  }
  if (audit.painPoint) {
    assert(countOccurrences(html, `data-pain-point="${audit.painPoint}"`) === 2, `${page}: body and form expose the approved service context`)
  }

  const metadataChecks = [
    ['title', documentTitle(html), audit.title],
    ['description', metaContent(html, 'description'), audit.description],
    ['canonical', canonicalUrl(html), audit.canonical],
    ['Open Graph image', metaContent(html, 'og:image'), audit.ogImage]
  ]

  for (const [label, actual, expected] of metadataChecks) {
    assert(actual === expected, `${page}: unique ${label} matches the page contract`)
  }

  assert(metadataEntries.filter((entry) => entry.title === audit.title).length === 1, `${page}: title is unique across audited pages`)
  assert(metadataEntries.filter((entry) => entry.description === audit.description).length === 1, `${page}: description is unique across audited pages`)
  assert(metadataEntries.filter((entry) => entry.canonical === audit.canonical).length === 1, `${page}: canonical is unique across audited pages`)
  assert(metadataEntries.filter((entry) => entry.ogImage === audit.ogImage).length === 1, `${page}: Open Graph image is unique across audited pages`)

  const structuredData = jsonLdBlocks(html)
  assert(structuredData.length > 0, `${page}: JSON-LD block rendered`)
  for (const [index, block] of structuredData.entries()) {
    try {
      const value = JSON.parse(block)
      assert(value['@type'] === 'Service', `${page}: JSON-LD block ${index + 1} describes a Service`)
    } catch (error) {
      failures.push(`${page}: JSON-LD block ${index + 1} parses as JSON (${error.message})`)
    }
  }

  for (const marker of ['â', 'Â', '�']) {
    assert(!html.includes(marker), `${page}: landing copy has no mojibake marker ${JSON.stringify(marker)}`)
  }
}

const robotsPath = join(root, 'robots.txt')
const sitemapPath = join(root, 'sitemap.xml')
assert(existsSync(robotsPath), 'robots.txt exists')
assert(existsSync(sitemapPath), 'sitemap.xml exists')
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

const generatedMetadata = htmlFiles.map((file) => {
  const html = readFileSync(file, 'utf8')
  return {
    file,
    title: documentTitle(html),
    description: metaContent(html, 'description'),
    canonical: canonicalUrl(html),
    ogImage: metaContent(html, 'og:image')
  }
})

const sitemapXml = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : ''

for (const audit of landingPageAudits) {
  const file = routeToFile(audit.route)
  assert(existsSync(file), `landing page exists: ${audit.route}`)
  if (!existsSync(file)) continue
  auditLandingPageHtml(audit, readFileSync(file, 'utf8'), generatedMetadata, sitemapXml)
}

const inMemoryLandingAudit = {
  route: '/__fixtures__/landing-page/',
  title: 'Landing Template Fixture | Naked Tech',
  description: 'Synthetic noindex copy used only to verify the reusable Naked Tech landing-page template contract.',
  canonical: 'https://nakedtech.au/__fixtures__/landing-page/',
  ogImage: 'https://nakedtech.au/img/toolkit-flatlay.webp',
  painPoint: 'template_fixture',
  primaryLabel: 'Open the synthetic enquiry form',
  primaryHref: '#contact',
  robots: 'noindex, nofollow',
  sitemap: 'absent'
}

assert(!existsSync(routeToFile(inMemoryLandingAudit.route)), 'temporary generated landing-page fixture is absent')

const inMemoryLandingContext = {
  title: 'Landing Template Fixture',
  description: inMemoryLandingAudit.description,
  robots: inMemoryLandingAudit.robots,
  ogImage: '/img/toolkit-flatlay.webp',
  ogImageWidth: 1408,
  ogImageHeight: 768,
  page: { url: inMemoryLandingAudit.route },
  site: JSON.parse(readFileSync(new URL('../src/_data/site.json', import.meta.url), 'utf8')),
  landing: {
    id: 'template_fixture',
    eyebrow: 'Synthetic landing-page fixture',
    headline: 'A complete non-public page for testing the shared template',
    promise: 'Synthetic copy exercises every required conversion section without publishing a commercial claim.',
    offer: {
      label: 'Automated test offer',
      price: 'Synthetic fixture only',
      note: 'This in-memory fixture is not a public offer, guarantee, testimonial, or statement of service scope.'
    },
    cta: {
      primaryLabel: inMemoryLandingAudit.primaryLabel,
      primaryHref: inMemoryLandingAudit.primaryHref,
      phoneLabel: 'Call Naked Tech from the template fixture'
    },
    symptoms: [
      { title: 'First synthetic symptom', description: 'Exercises the first symptom card without describing a real customer.' },
      { title: 'Second synthetic symptom', description: 'Exercises the second symptom card with plain fixture copy.' },
      { title: 'Third synthetic symptom', description: 'Exercises the required third symptom card and exact item count.' }
    ],
    diagnosis: {
      heading: 'Synthetic diagnostic sequence',
      summary: 'The fixture verifies that assessment can precede recommendations without promising an outcome.',
      checks: [
        { title: 'First synthetic check', description: 'Exercises one diagnostic card without claiming a real check occurred.' },
        { title: 'Second synthetic check', description: 'Exercises an additional diagnostic card and reusable grid layout.' }
      ]
    },
    inclusions: [
      { title: 'Fixture deliverable one', description: 'Confirms the shared layout renders a scoped inclusion.' },
      { title: 'Fixture deliverable two', description: 'Confirms multiple inclusions render in both relevant sections.' }
    ],
    process: [
      { title: 'Synthetic step one', description: 'Supplies the first required process step.' },
      { title: 'Synthetic step two', description: 'Supplies the second required process step.' },
      { title: 'Synthetic step three', description: 'Supplies the third required process step.' }
    ],
    proofPoints: [
      { title: 'Fixture proof one', description: 'Synthetic proof text used only by the audit.', source: 'Automated P1-T5 fixture data' },
      { title: 'Fixture proof two', description: 'A second trust point verifies the proof layout.', source: 'Automated P1-T5 fixture data' },
      { title: 'Fixture proof three', description: 'A third trust point completes the required count.', source: 'Automated P1-T5 fixture data' }
    ],
    faqs: [
      { question: 'Is this a real public offer?', answer: 'No. It is synthetic noindex copy used only by the automated audit.' },
      { question: 'Does this fixture make commercial claims?', answer: 'No. Its values are explicitly synthetic.' },
      { question: 'Why does it include every section?', answer: 'Complete data proves the full reusable layout contract.' }
    ],
    form: {
      heading: 'Synthetic enquiry form heading',
      introduction: 'The shared form is rendered only to verify the integration markup.',
      contextKey: 'template_fixture'
    },
    schema: {
      serviceType: 'Synthetic landing-page template fixture',
      areaServed: ['Synthetic test area']
    }
  }
}

const landingEnvironment = nunjucks.configure(includesRoot, { autoescape: true })
const landingLayoutSource = readFileSync(join(includesRoot, 'layouts', 'sales-landing-page.njk'), 'utf8')
  .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
const inMemoryLandingContent = landingEnvironment.renderString(landingLayoutSource, inMemoryLandingContext)
const inMemoryLandingHtml = landingEnvironment.render('layouts/base.njk', {
  ...inMemoryLandingContext,
  content: inMemoryLandingContent
})
const inMemoryLandingMetadata = {
  title: documentTitle(inMemoryLandingHtml),
  description: metaContent(inMemoryLandingHtml, 'description'),
  canonical: canonicalUrl(inMemoryLandingHtml),
  ogImage: metaContent(inMemoryLandingHtml, 'og:image')
}
auditLandingPageHtml(
  inMemoryLandingAudit,
  inMemoryLandingHtml,
  [...generatedMetadata, inMemoryLandingMetadata],
  sitemapXml
)

for (const slug of ['full-strip', 'bodyguard', 'power-pose', 'quickie']) {
  const file = routeToFile(`/services/${slug}/`)
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf8')
  for (const sectionId of ['included', 'process', 'faq']) {
    assert(html.includes(`id="${sectionId}"`), `${slug}: #${sectionId} section rendered`)
  }
  assert(html.includes('href="#process"'), `${slug}: contextual how-it-works nav targets local process`)
  assert(html.includes('Hardware sold at cost. No markups.'), `${slug}: transparent hardware policy rendered`)
  assert(html.includes('href="/contact/"'), `${slug}: contact CTA rendered`)
}

const quickieHtml = readFileSync(routeToFile('/services/quickie/'), 'utf8')
assert(
  quickieHtml.includes('href="/services/slow-computer-help-ivanhoe/"'),
  'quickie: dedicated slow-computer diagnosis link rendered'
)
assert(
  quickieHtml.includes('href="/services/printer-help-ivanhoe/"'),
  'quickie: dedicated printer-help link rendered'
)
assert(
  quickieHtml.includes('href="/services/email-help-ivanhoe/"'),
  'quickie: dedicated email-help link rendered'
)

const servicesHtml = readFileSync(routeToFile('/services/'), 'utf8')
const servicesMain = servicesHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
assert(Boolean(servicesMain), 'services: main content rendered')
for (const sectionId of ['find-help', 'projects', 'pricing', 'how-it-works']) {
  assert(countOccurrences(servicesMain, `id="${sectionId}"`) === 1, `services: exactly one #${sectionId} section rendered`)
}
assert(countOccurrences(servicesMain, 'data-service-path') === 6, 'services: six assessment and guided-service paths rendered')
for (const route of [
  '/services/wifi-dropouts-ivanhoe/',
  '/services/slow-computer-help-ivanhoe/',
  '/services/scam-security-help-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/printer-help-ivanhoe/',
  '/services/email-help-ivanhoe/'
]) {
  assert(servicesMain.includes(`href="${route}"`), `services: direct problem route rendered in main (${route})`)
}
assert(countOccurrences(servicesMain, 'data-project-service') === 4, 'services: four broader project routes rendered')
for (const slug of ['full-strip', 'bodyguard', 'power-pose', 'quickie']) {
  assert(servicesMain.includes(`href="/services/${slug}/"`), `services: broader project route rendered in main (${slug})`)
}
assert(servicesMain.includes('$550 fixed · incl. GST'), 'services: approved new-computer price summary rendered')
assert(servicesMain.includes('Money may still be at risk?'), 'services: urgent bank-first guidance rendered')
assert(servicesHtml.includes('href="#how-it-works"'), 'services navigation: how-it-works link targets local overview')
assert(!servicesHtml.includes('href="/#how-it-works"'), 'services navigation: no cross-page how-it-works link remains')
assert(servicesMain.includes('href="/contact/"'), 'services: final enquiry CTA rendered')
assert(/href=["']tel:\+\d{10,15}["']/i.test(servicesMain), 'services: direct telephone CTA rendered')
assert(!servicesHtml.includes('data-pain-point'), 'services: hub does not claim a pain-point analytics context')
assert(!servicesHtml.includes('data-pain-page-view-tracking'), 'services: hub does not emit a landing-page view event')
assert(!servicesMain.includes('<iframe'), 'services: hub does not embed a contact form')
assert(documentTitle(servicesHtml) === 'Services &amp; Pricing Ivanhoe &amp; Eaglemont | Naked Tech', 'services: title describes local services and pricing')
assert(
  metaContent(servicesHtml, 'description') === 'Compare fixed-price home technology assessments, setup services and larger projects for Ivanhoe and Eaglemont.',
  'services: description reflects assessments, setup services and projects'
)
assert(canonicalUrl(servicesHtml) === 'https://nakedtech.au/services/', 'services: canonical URL is stable')
assert(metaContent(servicesHtml, 'og:image') === 'https://nakedtech.au/img/nakedtech_hero_technician.webp', 'services: default Open Graph image remains stable')

for (const supersededRoute of ['/wifi-dropouts-ivanhoe/', '/slow-computer-help-ivanhoe/', '/printer-help-ivanhoe/', '/email-help-ivanhoe/']) {
  assert(!existsSync(routeToFile(supersededRoute)), `${supersededRoute}: superseded root route is absent`)
}

const baseHtml = readFileSync(join(root, 'index.html'), 'utf8')
assert(baseHtml.includes('03 7068 5422'), 'phone number present in header/nav')
assert(/href="tel:\+\d{10,15}"/.test(baseHtml), 'phone number is tel: link')
assert(baseHtml.includes('id="find-help"'), 'homepage: problem-first help chooser rendered')
assert(baseHtml.includes('id="how-it-works"'), 'homepage: how-it-works section rendered')
assert(baseHtml.includes('What’s giving you grief?'), 'homepage: customer problem heading rendered')
for (const route of [
  '/services/wifi-dropouts-ivanhoe/',
  '/services/slow-computer-help-ivanhoe/',
  '/services/scam-security-help-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/printer-help-ivanhoe/',
  '/services/email-help-ivanhoe/'
]) {
  assert(baseHtml.includes(`href="${route}"`), `homepage: direct problem route rendered (${route})`)
}
assert(
  countOccurrences(baseHtml, 'href="/services/new-computer-setup-data-transfer-ivanhoe/"') >= 4,
  'navigation and footer: new-computer route is available on desktop, mobile and the homepage'
)
assert(
  countOccurrences(baseHtml, 'href="/services/printer-help-ivanhoe/"') >= 4,
  'navigation and footer: printer-help route is available on desktop, mobile and the homepage'
)
assert(
  countOccurrences(baseHtml, 'href="/services/email-help-ivanhoe/"') >= 4,
  'navigation and footer: email-help route is available on desktop, mobile and the homepage'
)
assert(baseHtml.includes('HELP WITH'), 'navigation: desktop problem menu rendered')
assert(baseHtml.includes('aria-label="Navigation menu"'), 'navigation: mobile menu control rendered')
assert(baseHtml.includes('data-navigation-disclosures'), 'navigation: disclosure behaviour rendered')
assert(baseHtml.includes('SERVICES &amp; PRICING'), 'navigation: services and pricing link rendered')
assert(baseHtml.includes('href="#how-it-works"'), 'homepage navigation: how-it-works link targets local overview')
assert(baseHtml.includes('data-theme-bootstrap'), 'theme: no-flash bootstrap rendered')
assert(baseHtml.indexOf('data-theme-bootstrap') < baseHtml.indexOf('href="/css/styles.css"'), 'theme: bootstrap runs before stylesheet')
assert(baseHtml.includes('data-theme-controls'), 'theme: persistent controls rendered')
for (const choice of ['system', 'light', 'dark']) {
  assert(baseHtml.includes(`data-theme-choice="${choice}"`), `theme: ${choice} choice rendered`)
}
assert(baseHtml.includes('aria-label="Problem help"'), 'footer: problem-help navigation rendered')
assert(baseHtml.includes('aria-label="Services and projects"'), 'footer: services navigation rendered')
assert(baseHtml.includes('aria-label="Company information"'), 'footer: company navigation rendered')
assert(baseHtml.includes('Good-looking technology. Even better when it works.'), 'footer: approved closing line rendered')

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
  const dedicatedFormSlug = 'nakedtech-new-computer-move-suitability'
  const dedicatedComponentHtml = metadataEnvironment.renderString(componentTemplate, {
    formProps: { ...formProps, formSlug: dedicatedFormSlug }
  })
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
  assert(componentHtml.includes('https://forms.digitalsanctum.com.au/f/nakedtech-contact'), 'contact-form fixture preserves the default Sanctum Forms endpoint')
  assert(dedicatedComponentHtml.includes(`https://forms.digitalsanctum.com.au/f/${dedicatedFormSlug}`), 'contact-form fixture renders an approved dedicated Forms slug at the fixed origin')
  assert(!dedicatedComponentHtml.includes('scrolling="no"'), 'contact-form fixture preserves a browser scrolling fallback when resize messaging is unavailable')
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
    window: { location: { pathname: '/services/wifi-dropouts-ivanhoe/' } },
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
    assert(metaContactCalls[0]?.[2]?.page_path === '/services/wifi-dropouts-ivanhoe/', 'Meta Contact includes page-path context')
    assert(gaPhoneCalls[0]?.[2]?.pain_point === 'wifi_dropouts', 'GA4 phone_click includes page pain-point context')
    assert(gaPhoneCalls[0]?.[2]?.page_path === '/services/wifi-dropouts-ivanhoe/', 'GA4 phone_click includes page-path context')
  }
}

if (failures.length) {
  console.error(`Site audit failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`  ✗ ${failure}`)
  console.error(`\n${passes.length} checks passed before failure.`)
  process.exit(1)
}

console.log(`Site audit passed: ${passes.length} checks across ${htmlFiles.length} generated pages.`)
