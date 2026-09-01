import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative } from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import nunjucks from 'nunjucks'

const require = createRequire(import.meta.url)
const serviceCatalogue = require('../src/_data/serviceCatalogue.js')
const searchContent = require('../src/_data/searchContent.js')
const searchIntents = require('../src/assets/js/site-search-intents.js')

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

function htmlText(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
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

function pagefindMetaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const metadataKey = tag.match(/\bdata-pagefind-meta=(["'])(.*?)\1/i)?.[2]
    if (metadataKey !== `${key}[content]`) continue
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
  '/services/virus-malware-help-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/printer-help-ivanhoe/',
  '/services/email-help-ivanhoe/',
  '/services/new-printer-setup-ivanhoe/',
  '/services/backup-setup-ivanhoe/',
  '/services/phone-tablet-setup-migration-ivanhoe/',
  '/services/password-manager-setup-ivanhoe/',
  '/booking/',
  '/contact/',
  '/ivanhoe-primary-school-fundraiser/',
  '/brand/',
  '/toolkit/',
  '/join/',
  '/legal/',
  '/service-terms/',
  '/terms/',
  '/privacy/',
  '/thank-you/'
]

// Register approved public pain-page routes here as they are created.
// The non-public template contract remains exercised by the in-memory fixture below.
const landingPageAudits = [
  {
    route: '/services/wifi-dropouts-ivanhoe/',
    title: 'Wi-Fi Dropout Diagnosis Ivanhoe &amp; Eaglemont | Naked Tech',
    description: 'Fixed-price $190 incl. GST Wi-Fi dropout diagnosis for Ivanhoe and Eaglemont homes, separating NBN, router, placement, interference and coverage problems.',
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
    description: 'Fixed-price $190 incl. GST onsite slow-computer assessment for Ivanhoe and Eaglemont, with Windows compatibility and a written fix, upgrade or replace plan.',
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
  description: 'Calm $250 incl. GST onsite scam and account-security assessment for Ivanhoe and Eaglemont, covering devices, browsers, exposed accounts and practical next steps.',
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
    'Unpacking and installing a new printer',
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

landingPageAudits.push({
  route: '/services/new-printer-setup-ivanhoe/',
  title: 'New Printer Setup Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $250 incl. GST onsite setup for one new household printer and one primary supported device in Ivanhoe or Eaglemont.',
  canonical: 'https://nakedtech.au/services/new-printer-setup-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/new-printer-setup-og.webp',
  painPoint: 'new_printer_setup',
  variant: 'guided-service',
  visualImage: '/img/new-printer-setup-og.webp',
  visualHeading: 'Ready for the way you actually print.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the new-printer visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$250 fixed incl. GST',
    'up to 90 minutes onsite',
    'One customer-supplied new household printer',
    'one primary supported device',
    'Unboxing and ordinary assembly',
    'manufacturer account',
    'does not record or retain',
    'Monday to Friday',
    'no automatic hourly overrun',
    'Call Peter about your new printer',
    'Tell Peter about your new printer.'
  ]
})

landingPageAudits.push({
  route: '/services/password-manager-setup-ivanhoe/',
  title: 'Password Manager Setup Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $390 incl. GST onsite password-manager setup in Ivanhoe and Eaglemont for one personal vault, two supported devices and a practical recovery plan.',
  canonical: 'https://nakedtech.au/services/password-manager-setup-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/password-safety-control-og.webp',
  painPoint: 'password_safety_control',
  variant: 'guided-service',
  visualImage: '/img/password-safety-control-og.webp',
  visualHeading: 'Safer does not have to mean harder.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the password visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$390 fixed incl. GST',
    'up to two hours onsite',
    'one personal vault',
    'one primary computer and one phone or tablet',
    'One supported import',
    'Your passwords stay yours.',
    'does not record, photograph, copy, transmit or retain',
    'provider-controlled account recovery',
    'Scam &amp; Account-Security Assessment',
    'Call about password setup',
    'Tell us how you manage passwords now.'
  ]
})

landingPageAudits.push({
  route: '/services/virus-malware-help-ivanhoe/',
  title: 'Virus &amp; Malware Removal Help Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $250 incl. GST onsite virus and malware diagnosis and safe removal for one Windows or Mac computer in Ivanhoe and Eaglemont, with written next steps.',
  canonical: 'https://nakedtech.au/services/virus-malware-help-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/virus-malware-help-og.webp',
  painPoint: 'virus_malware',
  visualImage: '/img/virus-malware-help-og.webp',
  visualHeading: 'Check what is actually happening.',
  primaryLabel: 'Book the $250 malware visit',
  primaryHref: '#contact',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$250 fixed incl. GST',
    'up to 90 minutes onsite',
    'one working, bootable personal Windows or Mac computer',
    'Safe removal and browser cleanup',
    'No tool or short visit can guarantee that a device is completely clean',
    'ransomware decryption',
    'provider-controlled account recovery',
    'does not record, photograph, copy, transmit or retain'
  ]
})

landingPageAudits.push({
  route: '/services/backup-setup-ivanhoe/',
  title: 'Computer Backup Setup Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $250 incl. GST onsite backup setup in Ivanhoe and Eaglemont for one Windows or Mac computer and one supported local or cloud destination.',
  canonical: 'https://nakedtech.au/services/backup-setup-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/backup-setup-og.webp',
  painPoint: 'backup_setup',
  variant: 'guided-service',
  visualImage: '/img/backup-setup-og.webp',
  visualHeading: 'A backup is useful only when you can check it.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the backup visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$250 fixed incl. GST',
    'up to 90 minutes onsite',
    'One working personal Windows or Mac computer',
    'One supported local external drive or one personal cloud destination',
    'Small backup and sample restore',
    'Backup setup is not data recovery.',
    'does not recover deleted files or failed drives',
    'Call Peter about your backup'
  ]
})

landingPageAudits.push({
  route: '/services/phone-tablet-setup-migration-ivanhoe/',
  title: 'Phone &amp; Tablet Setup and Migration Ivanhoe &amp; Eaglemont | Naked Tech',
  description: 'Fixed-price $390 incl. GST onsite phone and tablet setup or same-ecosystem migration in Ivanhoe and Eaglemont for one person and two supported devices.',
  canonical: 'https://nakedtech.au/services/phone-tablet-setup-migration-ivanhoe/',
  ogImage: 'https://nakedtech.au/img/phone-tablet-setup-migration-og.webp',
  painPoint: 'mobile_setup',
  variant: 'guided-service',
  visualImage: '/img/phone-tablet-setup-migration-og.webp',
  visualHeading: 'Your accounts and unlock codes stay in your hands.',
  primaryLabel: 'Send a quick enquiry',
  primaryHref: '#contact',
  detailLabel: 'See if the phone or tablet visit fits',
  robots: 'index, follow',
  sitemap: 'present',
  contentMarkers: [
    '$390 fixed incl. GST',
    'up to two hours onsite',
    'one working and unlocked source device',
    'Apple-to-Apple or Android-to-Android',
    'myGov or online-banking setup',
    'does not erase, reset, trade in or dispose of the source',
    'Call Peter about your device move'
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
  const offerSection = html.match(/<header\b[^>]*id=["']offer["'][\s\S]*?<\/header>/i)?.[0] || ''
  const startingOffer = offerSection.match(/<aside\b[^>]*aria-label=["']Starting offer["'][\s\S]*?<\/aside>/i)?.[0] || ''
  const catalogueDescription = serviceCatalogue.byKey[audit.painPoint]?.description
  assert(countOccurrences(startingOffer, 'data-starting-offer-summary') === 1, `${page}: hero offer card renders one concise summary`)
  if (catalogueDescription) {
    assert(startingOffer.includes(catalogueDescription), `${page}: hero offer card uses the concise catalogue description`)
  }
  for (const sectionId of requiredSectionIds) {
    assert(countOccurrences(html, `id="${sectionId}"`) === 1, `${page}: exactly one #${sectionId} section rendered`)
  }
  if (isGuidedService) {
    for (const sectionId of guidedForbiddenSectionIds) {
      assert(countOccurrences(html, `id="${sectionId}"`) === 0, `${page}: compact guided service omits #${sectionId}`)
    }

    const phonePrimary = offerSection.match(/<a\b[^>]*data-hero-phone-primary[^>]*>/i)?.[0] || ''
    const formSecondary = offerSection.match(/<a\b[^>]*data-hero-form-secondary[^>]*>/i)?.[0] || ''
    assert(countOccurrences(offerSection, 'data-hero-phone-primary') === 1, `${page}: hero renders one phone-first action`)
    assert(countOccurrences(offerSection, 'data-hero-form-secondary') === 1, `${page}: hero renders one secondary enquiry action`)
    assert(offerSection.indexOf('data-hero-phone-primary') < offerSection.indexOf('data-hero-form-secondary'), `${page}: phone action precedes enquiry action in DOM order`)
    assert(/href=["']tel:\+\d{10,15}["']/i.test(phonePrimary), `${page}: primary hero action is a telephone link`)
    assert(/href=["']#contact["']/i.test(formSecondary), `${page}: secondary hero action targets the shared enquiry form`)
    assert(phonePrimary.includes('whitespace-nowrap') && formSecondary.includes('whitespace-nowrap'), `${page}: guided hero actions cannot wrap their labels`)
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
  } else {
    const formPrimary = offerSection.match(/<a\b[^>]*data-hero-form-primary[^>]*>/i)?.[0] || ''
    const phoneSecondary = offerSection.match(/<a\b[^>]*data-hero-phone-secondary[^>]*>/i)?.[0] || ''
    assert(formPrimary.includes('whitespace-nowrap') && phoneSecondary.includes('whitespace-nowrap'), `${page}: standard hero actions cannot wrap their labels`)

    const pricingSection = html.match(/<section\b[^>]*id=["']pricing["'][\s\S]*?<\/section>/i)?.[0] || ''
    const pricingPrimary = pricingSection.match(/<a\b[^>]*data-pricing-primary[^>]*>/i)?.[0] || ''
    const pricingPhone = pricingSection.match(/<a\b[^>]*data-pricing-phone[^>]*>/i)?.[0] || ''
    assert(countOccurrences(pricingSection, 'data-pricing-actions') === 1, `${page}: pricing actions use one shared stacked group`)
    assert(pricingPrimary.includes('w-full') && pricingPrimary.includes('whitespace-nowrap'), `${page}: pricing enquiry action is full-width and cannot wrap`)
    assert(pricingPhone.includes('w-full') && pricingPhone.includes('whitespace-nowrap'), `${page}: pricing telephone action is full-width and cannot wrap`)
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
  assert(countOccurrences(html, 'data-contact-collection-notice') === 1, `${page}: exactly one point-of-collection notice rendered`)
  assert(/<details\b(?![^>]*\bopen\b)[^>]*data-contact-collection-notice/i.test(html), `${page}: detailed collection notice is collapsed by default`)
  assert(html.indexOf('data-contact-collection-notice') < html.indexOf('data-contact-form-frame'), `${page}: collection notice appears before form fields`)
  assert(html.includes('href="/privacy/"'), `${page}: collection notice links the Privacy Policy`)
  assert(!html.includes('will never be shared or sold'), `${page}: inaccurate absolute data-sharing promise is absent`)
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
      assert(value.provider?.['@id'] === 'https://nakedtech.au/#business', `${page}: Service provider references the canonical business entity`)
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
const servicesJsonPath = join(root, 'services.json')
const versionJsonPath = join(root, 'version.json')
const nginxRedirectPath = new URL('../deploy/nginx/nakedtech-www-redirect.conf', import.meta.url).pathname
const nginxApexPath = new URL('../deploy/nginx/nakedtech.au.conf', import.meta.url).pathname
assert(existsSync(robotsPath), 'robots.txt exists')
assert(existsSync(sitemapPath), 'sitemap.xml exists')
assert(existsSync(servicesJsonPath), 'public service catalogue exists at /services.json')
assert(existsSync(versionJsonPath), 'public build identity exists at /version.json')
assert(existsSync(nginxRedirectPath), 'Nginx canonical-host redirect configuration exists')
assert(existsSync(nginxApexPath), 'Nginx apex-site configuration exists')
if (existsSync(robotsPath)) {
  assert(readFileSync(robotsPath, 'utf8').includes('https://nakedtech.au/sitemap.xml'), 'robots.txt advertises sitemap')
}
if (existsSync(nginxRedirectPath)) {
  const nginxRedirect = readFileSync(nginxRedirectPath, 'utf8')
  assert(countOccurrences(nginxRedirect, 'server_name www.nakedtech.au;') === 2, 'Nginx canonical-host redirect covers HTTP and HTTPS www requests')
  assert(nginxRedirect.includes('listen 80;'), 'Nginx canonical-host redirect listens for plain HTTP')
  assert(nginxRedirect.includes('listen 443 ssl;'), 'Nginx canonical-host redirect listens for HTTPS')
  assert(
    countOccurrences(nginxRedirect, 'return 301 https://nakedtech.au$request_uri;') === 2,
    'Nginx canonical-host redirect permanently preserves path and query on the apex HTTPS origin'
  )
  assert(nginxRedirect.includes('/etc/letsencrypt/live/nakedtech.au/fullchain.pem'), 'Nginx HTTPS redirect uses the active Naked Tech certificate')
  assert(!nginxRedirect.includes('https://www.nakedtech.au'), 'Nginx canonical-host redirect cannot target the duplicate www origin')
}
if (existsSync(nginxApexPath)) {
  const nginxApex = readFileSync(nginxApexPath, 'utf8')
  assert(countOccurrences(nginxApex, 'server_name nakedtech.au;') === 2, 'Nginx apex configuration covers HTTP and HTTPS')
  assert(nginxApex.includes('root /var/www/nakedtech.au/_site;'), 'Nginx apex configuration serves the deployed static output')
  assert(nginxApex.includes('location = /booking {'), 'Nginx apex configuration matches the legacy booking route without a slash')
  assert(nginxApex.includes('location = /booking/ {'), 'Nginx apex configuration matches the legacy booking route with a slash')
  assert(
    countOccurrences(nginxApex, 'return 301 https://nakedtech.au/contact/$is_args$args;') === 2,
    'Nginx permanently redirects both booking variants to contact while preserving query parameters'
  )
  assert(nginxApex.includes('location /api {'), 'Nginx apex configuration preserves the application API proxy')
  assert(nginxApex.includes('try_files $uri $uri/ =404;'), 'Nginx apex configuration preserves strict static route handling')
  assert(nginxApex.includes('add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;'), 'Nginx apex configuration enforces HSTS')
  assert(nginxApex.includes('add_header X-Frame-Options "SAMEORIGIN" always;'), 'Nginx apex configuration prevents cross-origin framing')
  assert(nginxApex.includes('add_header X-Content-Type-Options "nosniff" always;'), 'Nginx apex configuration disables MIME sniffing')
  assert(nginxApex.includes('add_header Content-Security-Policy'), 'Nginx apex configuration sends an enforced CSP')
  assert(nginxApex.includes("frame-src https://forms.digitalsanctum.com.au"), 'Nginx CSP permits the hosted contact form')
  assert(nginxApex.includes('https://www.googletagmanager.com'), 'Nginx CSP permits consent-gated Google analytics')
  assert(nginxApex.includes('https://connect.facebook.net'), 'Nginx CSP permits consent-gated Meta analytics')
  assert(!nginxApex.includes('include /etc/nginx/snippets/static-cache.conf;'), 'Nginx static assets cannot lose inherited security headers through the shared cache snippet')
}

for (const route of expectedRoutes) {
  assert(existsSync(routeToFile(route)), `route exists: ${route}`)
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'))
assert(htmlFiles.length >= expectedRoutes.length, `generated at least ${expectedRoutes.length} HTML pages`)

const pagefindRoot = join(root, 'pagefind')
const pagefindRuntimePath = join(pagefindRoot, 'pagefind.js')
const pagefindEntryPath = join(pagefindRoot, 'pagefind-entry.json')
assert(existsSync(pagefindRoot), 'search: generated Pagefind directory exists')
assert(existsSync(pagefindRuntimePath), 'search: generated Pagefind browser runtime exists')
assert(existsSync(pagefindEntryPath), 'search: generated Pagefind entry metadata exists')
assert(!existsSync(join(pagefindRoot, 'playground')), 'search: Pagefind playground is not included in the public build')

if (existsSync(pagefindEntryPath)) {
  try {
    const pagefindEntry = JSON.parse(readFileSync(pagefindEntryPath, 'utf8'))
    const pageCount = Object.values(pagefindEntry.languages || {}).reduce((total, language) => total + (language.page_count || 0), 0)
    assert(pagefindEntry.version === '1.5.2', 'search: generated runtime matches the pinned Pagefind version')
    assert(pageCount === searchContent.entries.length, `search: Pagefind indexes exactly ${searchContent.entries.length} intended pages`)
  } catch (error) {
    failures.push(`search: generated Pagefind entry metadata parses (${error.message})`)
  }
}

if (existsSync(pagefindRoot)) {
  const pagefindFiles = walk(pagefindRoot)
  assert(pagefindFiles.some((file) => /wasm\.[^.]+\.pagefind$/.test(file)), 'search: generated Pagefind WebAssembly runtime exists')
  assert(pagefindFiles.some((file) => file.endsWith('.pf_meta')), 'search: generated Pagefind language metadata exists')
  for (const file of pagefindFiles) {
    const contents = readFileSync(file)
    assert(!contents.includes(Buffer.from('/home/preginald/Dev/nakedtech')), `search: ${relative(root, file)} contains no internal project path`)
    assert(!contents.includes(Buffer.from('BEGIN PRIVATE KEY')), `search: ${relative(root, file)} contains no private-key material`)
  }
}

const indexedHtmlFiles = htmlFiles.filter((file) => /<main\b[^>]*\bdata-pagefind-body\b/i.test(readFileSync(file, 'utf8')))
assert(indexedHtmlFiles.length === searchContent.entries.length, `search: exactly ${searchContent.entries.length} generated pages opt into indexing`)

for (const entry of searchContent.entries) {
  const file = routeToFile(entry.path)
  const html = existsSync(file) ? readFileSync(file, 'utf8') : ''
  assert(Boolean(html), `search: indexed route exists (${entry.path})`)
  assert(/<main\b[^>]*\bdata-pagefind-body\b/i.test(html), `search: route explicitly opts into indexing (${entry.path})`)
  assert(pagefindMetaContent(html, 'title') === htmlText(entry.title), `search: route exposes its canonical result title (${entry.path})`)
  assert(pagefindMetaContent(html, 'description') === htmlText(entry.description), `search: route exposes its canonical result description (${entry.path})`)
  assert(pagefindMetaContent(html, 'kind') === htmlText(entry.kind), `search: route exposes its result type (${entry.path})`)
  assert(pagefindMetaContent(html, 'search_terms') === htmlText(entry.searchTerms), `search: route exposes reviewed visitor-language metadata (${entry.path})`)
  if (entry.price) {
    assert(pagefindMetaContent(html, 'price') === htmlText(entry.price), `search: route sources pricing from the canonical catalogue (${entry.path})`)
  }
  if (entry.serviceKey) {
    assert(pagefindMetaContent(html, 'service_key') === htmlText(entry.serviceKey), `search: route exposes only its canonical service key for bounded selection analytics (${entry.path})`)
  }
}

for (const service of serviceCatalogue.services) {
  const entry = searchContent.byPath[service.path]
  assert(Boolean(entry), `search: active service is registered (${service.name})`)
  assert(entry?.serviceName === service.name, `search: canonical service name is discoverable (${service.name})`)
  assert(entry?.serviceKey === service.serviceKey, `search: canonical service key is discoverable (${service.name})`)
  assert(entry?.price === service.pricing.displayText, `search: service price is not duplicated (${service.name})`)
}

for (const route of ['/services/bodyguard/', '/services/quickie/', '/booking/', '/thank-you/', '/invoice-template/', '/join/']) {
  const html = readFileSync(routeToFile(route), 'utf8')
  assert(!/<main\b[^>]*\bdata-pagefind-body\b/i.test(html), `search: excluded route does not opt into indexing (${route})`)
  assert(!pagefindMetaContent(html, 'search_terms'), `search: excluded route has no search metadata (${route})`)
}

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
    assert(
      html.includes('<link rel="alternate" type="application/json" href="/services.json"'),
      `${page}: advertises the public JSON service catalogue`
    )
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

const sitemapEntries = [...sitemapXml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<\/url>/g)]
const sitemapLocations = sitemapEntries.map((entry) => entry[1])
const sitemapDates = sitemapEntries.map((entry) => entry[2])
assert(sitemapEntries.length === 23, 'sitemap: every canonical public URL has a last-modified date')
assert(new Set(sitemapLocations).size === sitemapEntries.length, 'sitemap: canonical locations are unique')
assert(sitemapDates.every((date) => /^\d{4}-\d{2}-\d{2}$/.test(date)), 'sitemap: last-modified dates use the W3C calendar-date format')
assert(sitemapDates.every((date) => Date.parse(`${date}T00:00:00Z`) <= Date.now()), 'sitemap: last-modified dates are not in the future')
assert(!sitemapLocations.includes('https://nakedtech.au/booking/'), 'sitemap: legacy booking redirect is excluded')

if (existsSync(servicesJsonPath)) {
  try {
    const publicCatalogueSource = readFileSync(servicesJsonPath, 'utf8')
    const publicCatalogue = JSON.parse(publicCatalogueSource)
    const publicServices = publicCatalogue.services || []
    const machineHubHtml = readFileSync(routeToFile('/services/'), 'utf8')
    const machineIds = publicServices.map((service) => service.id)
    const serviceKeys = publicServices.map((service) => service.serviceKey)
    const canonicalUrls = publicServices.map((service) => service.canonicalUrl)

    assert(publicCatalogue.schemaVersion === '1.0', 'service catalogue: schema version is 1.0')
    assert(publicServices.length === 13, 'service catalogue: exactly 13 services are published')
    assert(publicServices.every((service) => service.status === 'active'), 'service catalogue: every published service is active')
    assert(new Set(machineIds).size === 13, 'service catalogue: machine IDs are unique')
    assert(new Set(serviceKeys).size === 13, 'service catalogue: service keys are unique')
    assert(new Set(canonicalUrls).size === 13, 'service catalogue: canonical URLs are unique')
    assert(
      machineIds.every((id) => /^au\.nakedtech\.service\.[a-z0-9_]+$/.test(id)),
      'service catalogue: machine IDs use the permanent Naked Tech namespace'
    )
    assert(!publicCatalogueSource.toLowerCase().includes('bodyguard'), 'service catalogue: retired Bodyguard is absent')
    assert(!publicCatalogueSource.toLowerCase().includes('quickie'), 'service catalogue: retired Quickie is absent')
    assert(
      JSON.stringify(publicCatalogue) === JSON.stringify(serviceCatalogue.public),
      'service catalogue: generated JSON exactly matches the canonical source projection'
    )
    for (const marker of ['/home/', '_site/', 'node_modules/', '.git/', 'projectServices.json', 'serviceCatalogue.js']) {
      assert(!publicCatalogueSource.includes(marker), `service catalogue: excludes internal marker ${marker}`)
    }
    assert(!Object.hasOwn(publicCatalogue.publisher || {}, 'operator'), 'service catalogue: excludes operator personal information')

    for (const service of publicServices) {
      const pathname = new URL(service.canonicalUrl).pathname
      const serviceFile = routeToFile(pathname)
      const serviceHtml = existsSync(serviceFile) ? readFileSync(serviceFile, 'utf8') : ''
      const structuredService = jsonLdBlocks(serviceHtml)
        .map((block) => JSON.parse(block))
        .find((value) => value['@type'] === 'Service')

      assert(existsSync(serviceFile), `service catalogue: canonical route exists (${pathname})`)
      assert(countOccurrences(sitemapXml, service.canonicalUrl) === 1, `service catalogue: URL appears exactly once in sitemap (${service.serviceKey})`)
      assert(machineHubHtml.includes(htmlText(service.name)), `service catalogue: hub card uses canonical name (${service.serviceKey})`)
      assert(machineHubHtml.includes(htmlText(service.pricing.displayText)), `service catalogue: hub card uses canonical price (${service.serviceKey})`)
      assert(serviceHtml.includes(htmlText(service.name)), `service catalogue: detail page uses canonical name (${service.serviceKey})`)
      assert(serviceHtml.includes(htmlText(service.pricing.displayText)), `service catalogue: detail page uses canonical price (${service.serviceKey})`)
      assert(structuredService?.['@id'] === `${service.canonicalUrl}#service`, `service schema: canonical page entity ID retained (${service.serviceKey})`)
      assert(structuredService?.identifier === service.id, `service schema: stable machine identifier rendered (${service.serviceKey})`)
      assert(structuredService?.name === service.name, `service schema: canonical name rendered (${service.serviceKey})`)
      assert(structuredService?.serviceType === service.serviceType, `service schema: canonical service type rendered (${service.serviceKey})`)
      assert(structuredService?.provider?.['@id'] === 'https://nakedtech.au/#business', `service schema: canonical business referenced (${service.serviceKey})`)
      assert(structuredService?.offers?.priceCurrency === 'AUD', `service schema: AUD price currency rendered (${service.serviceKey})`)
      assert(structuredService?.offers?.priceSpecification?.valueAddedTaxIncluded === true, `service schema: GST inclusion rendered (${service.serviceKey})`)
      assert(
        structuredService?.areaServed?.map((area) => `${area.address?.addressLocality}|${area.address?.addressRegion}|${area.address?.postalCode}|${area.address?.addressCountry}`).join(';') ===
          'Ivanhoe|VIC|3079|AU;Eaglemont|VIC|3084|AU',
        `service schema: structured service areas match the catalogue (${service.serviceKey})`
      )
      assert(service.deliveryMethod === 'in_home', `service catalogue: in-home delivery declared (${service.serviceKey})`)
      assert(
        service.booking?.mode === 'request' && service.booking?.humanConfirmationRequired === true && service.booking?.liveAvailability === false,
        `service catalogue: non-autonomous booking contract declared (${service.serviceKey})`
      )
      assert(service.pricing?.currency === 'AUD' && service.pricing?.includesGst === true, `service catalogue: AUD GST pricing declared (${service.serviceKey})`)

      if (service.pricing.model === 'fixed') {
        assert(Number.isFinite(service.pricing.amount), `service catalogue: fixed price has numeric amount (${service.serviceKey})`)
        assert(!Object.hasOwn(service.pricing, 'minimum') && !Object.hasOwn(service.pricing, 'maximum'), `service catalogue: fixed price omits range fields (${service.serviceKey})`)
        assert(structuredService?.offers?.price === service.pricing.amount, `service schema: fixed Offer price matches (${service.serviceKey})`)
        assert(structuredService?.offers?.priceSpecification?.price === service.pricing.amount, `service schema: fixed PriceSpecification matches (${service.serviceKey})`)
      } else if (service.pricing.model === 'range') {
        assert(Number.isFinite(service.pricing.minimum) && Number.isFinite(service.pricing.maximum), `service catalogue: range price has numeric bounds (${service.serviceKey})`)
        assert(!Object.hasOwn(service.pricing, 'amount'), `service catalogue: range price omits fixed amount (${service.serviceKey})`)
        assert(structuredService?.offers?.priceSpecification?.minPrice === service.pricing.minimum, `service schema: range minimum matches (${service.serviceKey})`)
        assert(structuredService?.offers?.priceSpecification?.maxPrice === service.pricing.maximum, `service schema: range maximum matches (${service.serviceKey})`)
      } else if (service.pricing.model === 'from') {
        assert(Number.isFinite(service.pricing.minimum), `service catalogue: from price has numeric minimum (${service.serviceKey})`)
        assert(!Object.hasOwn(service.pricing, 'amount') && !Object.hasOwn(service.pricing, 'maximum'), `service catalogue: from price omits fixed and maximum fields (${service.serviceKey})`)
        assert(structuredService?.offers?.priceSpecification?.minPrice === service.pricing.minimum, `service schema: from minimum matches (${service.serviceKey})`)
      } else {
        failures.push(`service catalogue: supported pricing model used (${service.serviceKey})`)
      }
    }
  } catch (error) {
    failures.push(`service catalogue: generated /services.json parses and audits (${error.message})`)
  }
}

if (existsSync(versionJsonPath)) {
  try {
    const version = JSON.parse(readFileSync(versionJsonPath, 'utf8'))
    const expectedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
    const expectedTimestamp = execFileSync('git', ['show', '-s', '--format=%cI', 'HEAD'], { encoding: 'utf8' }).trim()
    assert(
      Object.keys(version).sort().join('|') === 'catalogueSchemaVersion|commit|commitTimestamp',
      'build identity: contains only commit, timestamp and catalogue schema version'
    )
    assert(version.commit === expectedCommit && /^[0-9a-f]{40}$/.test(version.commit), 'build identity: full commit matches HEAD')
    assert(version.commitTimestamp === expectedTimestamp, 'build identity: commit timestamp matches HEAD')
    assert(version.catalogueSchemaVersion === serviceCatalogue.schemaVersion, 'build identity: catalogue schema version matches source')
  } catch (error) {
    failures.push(`build identity: generated /version.json parses and audits (${error.message})`)
  }
}

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
  ogImage: 'https://nakedtech.au/img/nakedtech-mark.png',
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
  ogImage: '/img/nakedtech-mark.png',
  ogImageWidth: 800,
  ogImageHeight: 800,
  page: { url: inMemoryLandingAudit.route },
  site: require('../src/_data/site.js'),
  serviceCatalogue: {
    byKey: {
      template_fixture: {
        id: 'au.nakedtech.service.template_fixture',
        serviceKey: 'template_fixture',
        name: 'Automated test offer',
        serviceType: 'Synthetic landing-page template fixture',
        canonicalUrl: 'https://nakedtech.au/__fixtures__/landing-page/',
        pricing: {
          model: 'fixed',
          currency: 'AUD',
          amount: 1,
          includesGst: true,
          displayText: 'Synthetic fixture only'
        },
        serviceAreas: [
          { locality: 'Synthetic', region: 'VIC', postcode: '3000', country: 'AU' }
        ]
      }
    }
  },
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

for (const slug of ['full-strip', 'power-pose']) {
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

const fundraiserRoute = '/ivanhoe-primary-school-fundraiser/'
const fundraiserHtml = readFileSync(routeToFile(fundraiserRoute), 'utf8')
const fundraiserPdfPath = join(root, 'assets', 'ivanhoe-primary-school-fundraiser-prizes.pdf')
assert(countOccurrences(fundraiserHtml, '<h1') === 1, 'fundraiser: exactly one h1 rendered')
assert(fundraiserHtml.includes('Two local technology prizes'), 'fundraiser: approved prize headline rendered')
assert(fundraiserHtml.includes('combined current advertised value of $440 incl. GST'), 'fundraiser: combined value is accurately qualified')
assert(fundraiserHtml.includes('$190') && fundraiserHtml.includes('$250'), 'fundraiser: both prize tiers rendered')
for (const service of serviceCatalogue.services.filter((service) => service.pricing.amount === 190 || service.pricing.amount === 250)) {
  assert(fundraiserHtml.includes(htmlText(service.name)), `fundraiser: canonical service name rendered (${service.serviceKey})`)
  assert(fundraiserHtml.includes(`href="${service.path}"`), `fundraiser: canonical service link rendered (${service.serviceKey})`)
}
assert(fundraiserHtml.includes('For one residential address in Ivanhoe or Eaglemont'), 'fundraiser: service area restriction is prominent')
assert(fundraiserHtml.includes('Monday to Friday, 9am-5pm'), 'fundraiser: weekday availability is disclosed')
assert(fundraiserHtml.includes('do not guarantee repair, recovery or complete resolution'), 'fundraiser: bounded outcome is disclosed')
assert(fundraiserHtml.includes('href="/service-terms/"'), 'fundraiser: customer service terms are linked')
assert(countOccurrences(fundraiserHtml, 'href="/assets/ivanhoe-primary-school-fundraiser-prizes.pdf"') === 2, 'fundraiser: PDF download is linked from hero and terms')
assert(countOccurrences(sitemapXml, 'https://nakedtech.au/ivanhoe-primary-school-fundraiser/') === 1, 'fundraiser: canonical route appears once in sitemap')
assert(existsSync(fundraiserPdfPath), 'fundraiser: branded PDF exists in the public build')
if (existsSync(fundraiserPdfPath)) {
  const fundraiserPdf = readFileSync(fundraiserPdfPath)
  assert(fundraiserPdf.subarray(0, 5).toString() === '%PDF-', 'fundraiser: branded PDF has a valid PDF signature')
  assert(fundraiserPdf.length > 10_000, 'fundraiser: branded PDF contains the designed page and QR asset')
}

const servicesHtml = readFileSync(routeToFile('/services/'), 'utf8')
const servicesMain = servicesHtml.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || ''
assert(Boolean(servicesMain), 'services: main content rendered')
for (const sectionId of ['find-help', 'projects', 'pricing', 'how-it-works']) {
  assert(countOccurrences(servicesMain, `id="${sectionId}"`) === 1, `services: exactly one #${sectionId} section rendered`)
}
assert(countOccurrences(servicesMain, 'data-service-path') === 11, 'services: eleven assessment and guided-service paths rendered')
assert(servicesMain.includes('id="service-cards"'), 'services: problem card grid has a stable local target')
assert(servicesMain.includes('lg:grid-cols-3'), 'services: problem cards use three desktop columns')
const catalogueProblemServices = serviceCatalogue.services.filter((service) => service.presentation.group === 'problem')
assert(catalogueProblemServices.filter((service) => service.presentation.navGroup === 'fix').length === 6, 'navigation: six problem-solving services use the fix group')
assert(catalogueProblemServices.filter((service) => service.presentation.navGroup === 'setup').length === 5, 'navigation: five setup services use the setup group')
for (const route of [
  '/services/wifi-dropouts-ivanhoe/',
  '/services/slow-computer-help-ivanhoe/',
  '/services/scam-security-help-ivanhoe/',
  '/services/virus-malware-help-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/printer-help-ivanhoe/',
  '/services/email-help-ivanhoe/',
  '/services/new-printer-setup-ivanhoe/',
  '/services/backup-setup-ivanhoe/',
  '/services/phone-tablet-setup-migration-ivanhoe/',
  '/services/password-manager-setup-ivanhoe/'
]) {
  assert(servicesMain.includes(`href="${route}"`), `services: direct problem route rendered in main (${route})`)
}
assert(countOccurrences(servicesMain, 'data-project-service') === 2, 'services: two supported broader project routes rendered')
for (const slug of ['full-strip', 'power-pose']) {
  assert(servicesMain.includes(`href="/services/${slug}/"`), `services: broader project route rendered in main (${slug})`)
}
assert(!servicesHtml.includes('href="/services/bodyguard/"'), 'retired Bodyguard offer is absent from services navigation and catalogue')
assert(!servicesHtml.includes('href="/services/quickie/"'), 'retired Quickie offer is absent from services navigation and catalogue')
assert(!servicesMain.includes('Smart home security'), 'services: unsupported smart-home security offer is not advertised')
assert(servicesMain.includes('$550 fixed incl. GST'), 'services: approved new-computer price summary rendered')
for (const price of ['$190 fixed incl. GST', '$250 fixed incl. GST', '$390 fixed incl. GST', '$550 fixed incl. GST']) {
  assert(servicesMain.includes(price), `services: GST-inclusive problem-service price rendered (${price})`)
}
for (const investment of ['$900–$1,800 incl. GST', '$350 incl. GST']) {
  assert(servicesMain.includes(investment), `services: GST-inclusive project investment rendered (${investment})`)
}
assert(servicesMain.includes('All published prices include GST.'), 'services: GST inclusion is stated beside pricing explanation')
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

const retiredBodyguardHtml = readFileSync(routeToFile('/services/bodyguard/'), 'utf8')
assert(metaContent(retiredBodyguardHtml, 'robots') === 'noindex, follow', 'retired Bodyguard route is excluded from search indexing')
assert(retiredBodyguardHtml.includes('content="0;url=/services/"'), 'retired Bodyguard route redirects visitors to current services')
assert(retiredBodyguardHtml.includes('This service is no longer offered.'), 'retired Bodyguard route explains the service withdrawal')
assert(!sitemapXml.includes('https://nakedtech.au/services/bodyguard/'), 'retired Bodyguard route is absent from the sitemap')

const retiredQuickieHtml = readFileSync(routeToFile('/services/quickie/'), 'utf8')
assert(metaContent(retiredQuickieHtml, 'robots') === 'noindex, follow', 'retired Quickie route is excluded from search indexing')
assert(retiredQuickieHtml.includes('content="0;url=/services/"'), 'retired Quickie route redirects visitors to current services')
assert(retiredQuickieHtml.includes('This service is no longer offered.'), 'retired Quickie route explains the service withdrawal')
assert(!sitemapXml.includes('https://nakedtech.au/services/quickie/'), 'retired Quickie route is absent from the sitemap')

const bookingHtml = readFileSync(routeToFile('/booking/'), 'utf8')
assert(metaContent(bookingHtml, 'robots') === 'noindex, follow', 'legacy booking fallback is excluded from search indexing')
assert(bookingHtml.includes('content="0;url=/contact/"'), 'legacy booking fallback sends visitors to the current contact route')
assert(!sitemapXml.includes('https://nakedtech.au/booking/'), 'legacy booking redirect is absent from the sitemap')

const joinHtml = readFileSync(routeToFile('/join/'), 'utf8')
assert(metaContent(joinHtml, 'robots') === 'noindex, follow', 'careers: inactive vacancy page is excluded from search indexing')
assert(joinHtml.includes('We’re not currently hiring.'), 'careers: inactive hiring status is explicit')
assert(joinHtml.includes('not accepting applications or expressions of interest'), 'careers: application collection is explicitly closed')
const joinPageForms = joinHtml.match(/<form\b[^>]*>/gi) || []
assert(joinPageForms.every((form) => /\brole=["']search["']/i.test(form) && /\bdata-site-search-form\b/i.test(form)), 'careers: inactive vacancy page does not collect applications')
assert(!joinHtml.includes('/api/send'), 'careers: inactive vacancy page has no submission endpoint')
assert(!joinHtml.includes('JobPosting'), 'careers: inactive vacancy page has no job structured data')
for (const disallowedRecruitmentMarker of ['Deadlift', 'fitted tee', 'physical fitness', 'Instagram URL']) {
  assert(!joinHtml.includes(disallowedRecruitmentMarker), `careers: removed recruitment marker (${disallowedRecruitmentMarker})`)
}
assert(!sitemapXml.includes('https://nakedtech.au/join/'), 'careers: noindex page is absent from the sitemap')

const houseRulesHtml = readFileSync(routeToFile('/legal/'), 'utf8')
assert(houseRulesHtml.includes('Respect and safety'), 'house rules: technician safety rule rendered')
assert(houseRulesHtml.includes('href="/service-terms/#cancellations"'), 'house rules: cancellation summary links to governing terms')
assert(houseRulesHtml.includes('href="/service-terms/"'), 'house rules: full service terms are linked')
assert(!houseRulesHtml.includes('Full fees will still apply'), 'house rules: blanket full-fee term is absent')
assert(!houseRulesHtml.includes('not liable for data loss'), 'house rules: blanket data-loss exclusion is absent')

const serviceTermsHtml = readFileSync(routeToFile('/service-terms/'), 'utf8')
assert(documentTitle(serviceTermsHtml) === 'Customer Service Terms | Naked Tech', 'service terms: descriptive title rendered')
assert(serviceTermsHtml.includes('id="cancellations"'), 'service terms: stable cancellation anchor rendered')
assert(serviceTermsHtml.includes('may charge up to $90'), 'service terms: qualified late-cancellation amount rendered')
assert(serviceTermsHtml.includes('will not exceed the reasonable loss and costs'), 'service terms: cancellation charge is tied to reasonable loss')
assert(serviceTermsHtml.includes('guarantees that cannot be excluded under the Australian Consumer Law'), 'service terms: mandatory consumer-guarantee principle rendered')
assert(serviceTermsHtml.includes('Nothing in these terms excludes, restricts or modifies'), 'service terms: ACL savings clause rendered')
assert(countOccurrences(sitemapXml, 'https://nakedtech.au/service-terms/') === 1, 'service terms: canonical route appears once in sitemap')

const websiteTermsHtml = readFileSync(routeToFile('/terms/'), 'utf8')
assert(documentTitle(websiteTermsHtml) === 'Website Terms of Use | Naked Tech', 'website terms: descriptive title rendered')
assert(websiteTermsHtml.includes('ABN 57 221 340 918'), 'website terms: operator ABN rendered')
assert(websiteTermsHtml.includes('href="/service-terms/"'), 'website terms: customer service terms linked')
assert(websiteTermsHtml.includes('Nothing in these terms excludes, restricts or modifies'), 'website terms: ACL savings clause rendered')
assert(websiteTermsHtml.includes('automated tools to retrieve our public service catalogue at a reasonable rate'), 'website terms: reasonable automated catalogue retrieval permitted')
assert(websiteTermsHtml.includes('attribute Naked Tech and link to the relevant service page'), 'website terms: automated display attribution and linking required')
assert(websiteTermsHtml.includes('binding quote, accepted booking or confirmed appointment'), 'website terms: catalogue is explicitly non-transactional')
assert(websiteTermsHtml.includes('automated catalogue use expressly permitted in section 2'), 'website terms: intellectual-property clause preserves catalogue permission')
assert(countOccurrences(sitemapXml, 'https://nakedtech.au/terms/') === 1, 'website terms: canonical route appears once in sitemap')

const privacyHtml = readFileSync(routeToFile('/privacy/'), 'utf8')
assert(documentTitle(privacyHtml) === 'Privacy Policy | Naked Tech', 'privacy: descriptive title rendered')
assert(metaContent(privacyHtml, 'description')?.includes('contact forms, service records, analytics and advertising choices'), 'privacy: metadata reflects current information handling')
assert(privacyHtml.includes('Effective 1 September 2026'), 'privacy: effective date rendered')
assert(privacyHtml.includes('Peter Reginald, ABN 57 221 340 918'), 'privacy: responsible operator and ABN rendered')
assert(privacyHtml.includes('forms.digitalsanctum.com.au'), 'privacy: embedded form provider disclosed')
assert(privacyHtml.includes('saves an unfinished draft in local storage'), 'privacy: contact-form draft storage disclosed')
assert(privacyHtml.includes('utm_source'), 'privacy: form campaign context disclosed')
assert(privacyHtml.includes('random correlation code'), 'privacy: operational lead correlation disclosed')
assert(privacyHtml.includes('Without the matching choice, the value is not attached'), 'privacy: attribution values are consent-gated')
assert(privacyHtml.includes('does not include your raw network address'), 'privacy: correlation context excludes raw network address')
assert(privacyHtml.includes('deleted after 90 days'), 'privacy: notification correlation retention disclosed')
assert(privacyHtml.includes('keyed pseudonyms derived from selected identity fields and the request network address'), 'privacy: keyed abuse evidence disclosed')
assert(privacyHtml.includes('scheduled for deletion after 30 days'), 'privacy: abuse-evidence retention disclosed')
assert(privacyHtml.includes('held in quarantine and will not trigger an owner notification'), 'privacy: quarantine effects disclosed')
assert(privacyHtml.includes('Cloudflare Turnstile'), 'privacy: adaptive challenge provider disclosed')
assert(privacyHtml.includes('Turnstile is a necessary security control rather than Analytics or Advertising'), 'privacy: necessary security is separated from optional tracking')
assert(privacyHtml.includes('https://www.cloudflare.com/turnstile-privacy-policy/'), 'privacy: Turnstile privacy addendum linked')
assert(privacyHtml.includes('Google Analytics 4'), 'privacy: analytics provider disclosed')
assert(privacyHtml.includes('Site-search words stay in your browser'), 'privacy: raw site-search text remains local')
assert(privacyHtml.includes('a search made before consent is not queued for later reporting'), 'privacy: search-demand events require prior analytics consent')
assert(privacyHtml.includes('predefined search-demand categories'), 'privacy: bounded service-demand analytics are disclosed')
assert(privacyHtml.includes('Meta Pixel'), 'privacy: advertising provider disclosed')
assert(privacyHtml.includes('neither checkbox is preselected'), 'privacy: optional tracking default described')
assert(privacyHtml.includes('data-tracking-preferences-open'), 'privacy: direct tracking-preferences control rendered')
assert(privacyHtml.includes('United States and other countries'), 'privacy: known overseas provider processing disclosed')
assert(privacyHtml.includes('Access, correction and deletion requests'), 'privacy: individual request process rendered')
assert(privacyHtml.includes('aim to provide a substantive response within 30 days'), 'privacy: complaint response process rendered')
assert(privacyHtml.includes('https://www.oaic.gov.au/privacy/privacy-complaints'), 'privacy: OAIC complaint route linked with qualified applicability')
assert(privacyHtml.includes('privacy@nakedtech.au'), 'privacy: privacy contact address rendered')
assert(!privacyHtml.includes('processed securely by Stripe'), 'privacy: unsupported Stripe processing claim is absent')

const toolkitHtml = readFileSync(routeToFile('/toolkit/'), 'utf8')
assert(documentTitle(toolkitHtml) === 'Technology Toolkit &amp; Selection Guide | Naked Tech', 'toolkit: descriptive title rendered')
assert(
  metaContent(toolkitHtml, 'description') === 'How Naked Tech selects supported home Wi-Fi, password, computer, printer and privacy tools for Ivanhoe and Eaglemont customers.',
  'toolkit: local and service-specific description rendered'
)
assert(metaContent(toolkitHtml, 'og:image') === 'https://nakedtech.au/img/toolkit-flatlay.webp', 'toolkit: relevant Open Graph image rendered')
assert(toolkitHtml.includes('Tools chosen for the job.'), 'toolkit: assessment-first heading rendered')
for (const principle of ['Fit', 'Support', 'Control', 'Whole cost']) {
  assert(toolkitHtml.includes(`>${principle}</h3>`), `toolkit: selection principle rendered (${principle})`)
}
for (const route of [
  '/services/wifi-dropouts-ivanhoe/',
  '/services/password-manager-setup-ivanhoe/',
  '/services/new-computer-setup-data-transfer-ivanhoe/',
  '/services/new-printer-setup-ivanhoe/',
  '/services/scam-security-help-ivanhoe/',
  '/services/',
  '/contact/'
]) {
  assert(toolkitHtml.includes(`href="${route}"`), `toolkit: relevant internal route linked (${route})`)
}
assert(toolkitHtml.includes('Hardware supplied by Naked Tech is shown separately at cost'), 'toolkit: hardware and service pricing are separated')
assert(toolkitHtml.includes('no affiliate links or paid product placements'), 'toolkit: current commercial relationship disclosure rendered')
assert(toolkitHtml.includes('https://www.cyber.gov.au/learn-basics/explore-basics/small-business'), 'toolkit: authoritative Australian cyber guidance linked')
for (const removedClaim of [
  'We show you <span class="text-accent">ours.</span>',
  'world’s best engineering',
  'world\'s best engineering',
  'world&#39;s best engineering',
  'banish dead zones',
  'total control',
  'military-grade encryption',
  'Stop big tech from reading your mail',
  'Custom Builds',
  'We use them because they are the best',
  'Ubiquiti UniFi',
  '1Password',
  'Proton Suite'
]) {
  assert(!toolkitHtml.includes(removedClaim), `toolkit: unsupported or stale claim is absent (${removedClaim})`)
}

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8')
  assert(html.includes('href="/legal/"'), `${relative(root, htmlFile)}: global footer links House Rules`)
  assert(html.includes('href="/service-terms/"'), `${relative(root, htmlFile)}: global footer links service terms`)
  assert(html.includes('href="/terms/"'), `${relative(root, htmlFile)}: global footer links website terms`)
}

for (const supersededRoute of ['/wifi-dropouts-ivanhoe/', '/slow-computer-help-ivanhoe/', '/printer-help-ivanhoe/', '/email-help-ivanhoe/']) {
  assert(!existsSync(routeToFile(supersededRoute)), `${supersededRoute}: superseded root route is absent`)
}

const baseHtml = readFileSync(join(root, 'index.html'), 'utf8')
const baseFooter = baseHtml.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || ''
const footerProjects = baseFooter.match(/<section\b[^>]*aria-labelledby=["']footer-projects-heading["'][^>]*>[\s\S]*?<\/section>/i)?.[0] || ''
const footerExplore = baseFooter.match(/<nav\b[^>]*aria-label=["']Explore Naked Tech["'][^>]*>[\s\S]*?<\/nav>/i)?.[0] || ''
assert(footerProjects.includes('href="/services/full-strip/"') && footerProjects.includes('href="/services/power-pose/"'), 'footer: broader service links are grouped under Projects')
assert(!footerExplore.includes('/services/full-strip/') && !footerExplore.includes('/services/power-pose/'), 'footer: Explore contains no broader service links')
const siteSearchSourcePath = new URL('../src/assets/js/site-search.js', import.meta.url).pathname
const siteSearchBuiltPath = join(root, 'assets', 'js', 'site-search.js')
const siteSearchIntentsSourcePath = new URL('../src/assets/js/site-search-intents.js', import.meta.url).pathname
const siteSearchIntentsBuiltPath = join(root, 'assets', 'js', 'site-search-intents.js')
const siteSearchDialogTag = baseHtml.match(/<dialog\b[^>]*data-site-search-dialog[^>]*>/i)?.[0] || ''
assert(existsSync(siteSearchBuiltPath), 'search: browser controller is copied into the public build')
assert(existsSync(siteSearchIntentsBuiltPath), 'search: bounded intent classifier is copied into the public build')
assert(countOccurrences(baseHtml, 'data-site-search-trigger') === 3, 'search: homepage, desktop navigation and mobile navigation each render one trigger')
assert(countOccurrences(baseHtml, 'data-site-search-source="navigation"') === 2, 'search: base layout renders separate desktop and mobile navigation triggers')
assert(countOccurrences(baseHtml, 'data-site-search-source="homepage"') === 1, 'search: homepage renders one modal launcher')
assert((baseHtml.match(/<button\b[^>]*data-site-search-trigger[^>]*aria-label=["']Search Naked Tech["'][^>]*\bhidden\b/gi) || []).length === 2, 'search: triggers are accessible buttons and fail safely when JavaScript is unavailable')
assert(/<dialog\b[^>]*data-site-search-dialog[^>]*aria-labelledby=["']site-search-heading["'][^>]*aria-describedby=["']site-search-description["']/i.test(baseHtml), 'search: labelled native dialog renders')
assert(/data-site-search-status[^>]*>/.test(baseHtml) && baseHtml.includes('aria-live="polite"'), 'search: result status has a polite live region')
assert(baseHtml.includes('src="/assets/js/site-search.js"') && baseHtml.includes(' data-site-search-script'), 'search: deferred browser controller is loaded')
assert(baseHtml.includes('src="/assets/js/site-search-intents.js"') && baseHtml.includes(' data-site-search-intents-script'), 'search: bounded intent classifier is loaded')
assert(baseHtml.indexOf('/assets/js/site-search-intents.js') < baseHtml.indexOf('/assets/js/site-search.js'), 'search: bounded classifier loads before the controller')
const homepageSearchTrigger = baseHtml.match(/<button\b[^>]*data-site-search-trigger[^>]*data-site-search-source=["']homepage["'][^>]*>[\s\S]*?<\/button>/i)?.[0] || ''
assert(Boolean(homepageSearchTrigger), 'search: homepage renders one prominent modal launcher')
assert(/\baria-label=["']Search Naked Tech from the homepage["']/i.test(homepageSearchTrigger), 'search: homepage launcher has an explicit accessible action name')
assert(/\bhidden\b/i.test(homepageSearchTrigger), 'search: homepage launcher fails safely when JavaScript is unavailable')
assert(/data-site-search-launcher-value[^>]*data-placeholder=/i.test(homepageSearchTrigger), 'search: homepage launcher exposes a safe text-only query mirror')
assert(baseHtml.includes('<noscript><a href="/services/"'), 'search: homepage provides a no-JavaScript services fallback')
assert(!baseHtml.includes('data-site-search-launch-output'), 'search: homepage does not render a second inline results layer')
assert(/data-pagefind-ignore[^>]*>[\s\S]*?data-site-search-source=["']homepage["']/i.test(baseHtml), 'search: homepage launcher does not pollute Pagefind excerpts')
assert(countOccurrences(servicesHtml, 'data-site-search-trigger') === 3, 'search: services page, desktop navigation and mobile navigation each render one trigger')
assert(countOccurrences(servicesHtml, 'data-site-search-source="services"') === 1, 'search: services page renders one prominent modal launcher')
const servicesSearchTrigger = servicesHtml.match(/<button\b[^>]*data-site-search-trigger[^>]*data-site-search-source=["']services["'][^>]*>[\s\S]*?<\/button>/i)?.[0] || ''
assert(/\baria-label=["']Search Naked Tech from services and pricing["']/i.test(servicesSearchTrigger), 'search: services launcher has an explicit accessible action name')
assert(/\bhidden\b/i.test(servicesSearchTrigger), 'search: services launcher fails safely when JavaScript is unavailable')
assert(/data-site-search-launcher-value[^>]*data-placeholder=/i.test(servicesSearchTrigger), 'search: services launcher exposes a safe text-only query mirror')
assert(servicesHtml.includes('<noscript><a href="#service-cards"'), 'search: services page provides a no-JavaScript card-grid fallback')
assert(/data-pagefind-ignore[^>]*>[\s\S]*?data-site-search-source=["']services["']/i.test(servicesHtml), 'search: services launcher does not pollute Pagefind excerpts')
assert(siteSearchDialogTag.includes('h-[calc(100vh-2rem)]') && siteSearchDialogTag.includes('sm:h-[42rem]'), 'search: dialog uses a stable responsive height')

if (existsSync(siteSearchSourcePath) && existsSync(siteSearchBuiltPath) && existsSync(siteSearchIntentsSourcePath) && existsSync(siteSearchIntentsBuiltPath)) {
  const siteSearchSource = readFileSync(siteSearchSourcePath, 'utf8')
  const siteSearchBuilt = readFileSync(siteSearchBuiltPath, 'utf8')
  const siteSearchIntentsSource = readFileSync(siteSearchIntentsSourcePath, 'utf8')
  const siteSearchIntentsBuilt = readFileSync(siteSearchIntentsBuiltPath, 'utf8')
  assert(siteSearchBuilt === siteSearchSource, 'search: deployed browser controller matches its reviewed source')
  assert(siteSearchIntentsBuilt === siteSearchIntentsSource, 'search: deployed intent classifier matches its reviewed source')
  assert(siteSearchSource.includes("import('/pagefind/pagefind.js')"), 'search: Pagefind loads lazily from the local static index')
  assert(siteSearchSource.includes('search.results.slice(0, 5)'), 'search: no more than five result records are loaded')
  assert(siteSearchSource.includes('plain_excerpt'), 'search: result excerpts use Pagefind plain text')
  assert(!siteSearchSource.includes('innerHTML'), 'search: browser controller never interpolates content through innerHTML')
  assert(!/\b(?:fbq|sendBeacon|fetch)\b/.test(siteSearchSource), 'search: browser controller has no advertising or custom network transport')
  assert(siteSearchSource.includes("tracking.getPreferences().analytics === true"), 'search: bounded analytics require an explicit current analytics opt-in')
  assert(siteSearchSource.includes("recordBoundedEvent('site_search_unmet_demand', intent, null, context.source)"), 'search: unmet demand uses one bounded category event with the correct entry point')
  assert(siteSearchSource.includes("recordBoundedEvent('site_search_interest', intent, intent.actionType, context.source)"), 'search: explicit service or referral interest uses one bounded event with the correct entry point')
  assert(siteSearchSource.includes("window.gtag('event', 'site_search_service_select'"), 'search: published-service selection uses one GA4-only bounded event')
  assert(siteSearchSource.includes("intent.resultState !== 'published_service'"), 'search: published service matches are not counted as unmet demand')
  assert(siteSearchSource.includes('pagefind.search(query)'), 'search: query is passed only to the local Pagefind runtime')
  assert(siteSearchSource.includes("source === 'homepage' || source === 'services'"), 'search: prominent page launchers retain bounded source attribution')
  assert(!siteSearchSource.includes('data-site-search-launch-output'), 'search: controller has no competing homepage results layer')
  assert(siteSearchSource.includes('renderResults(context, search, sequence)'), 'search: all search entry points use one result renderer')
  assert(siteSearchSource.includes("window.matchMedia('(prefers-reduced-motion: reduce)').matches"), 'search: dialog morph respects reduced-motion preferences')
  assert(siteSearchSource.includes('clipPath: launcherClip(origin)'), 'search: dialog progressively morphs from its opening trigger')
  assert(siteSearchSource.includes('clipPath: launcherClip(previousFocus)'), 'search: dialog progressively returns toward its opening trigger')
  assert(siteSearchSource.includes("dialog.classList.add('site-search-closing')"), 'search: dialog backdrop receives a coordinated closing state')
  assert(siteSearchSource.includes('value.textContent = query || placeholder'), 'search: modal query mirrors to page launchers through textContent only')
  assert(siteSearchSource.includes("trigger.classList.toggle('text-ink', Boolean(query))"), 'search: mirrored launcher query receives an active visual state')
  assert(siteSearchSource.includes('setResultsBusy(context, true)'), 'search: result updates expose a busy state without clearing visible cards')
  assert(siteSearchSource.includes('if (!hasVisibleResults) setStatus(context, \'Searching…\')'), 'search: repeated typing does not flash the searching status over existing cards')
  const scheduleSearchSource = siteSearchSource.match(/function scheduleSearch\([\s\S]*?\n  function showSearch/)?.[0] || ''
  assert(countOccurrences(scheduleSearchSource, 'clearResults(context)') === 1, 'search: active queries retain prior cards until replacement results are ready')
  assert(siteSearchSource.includes("addEventListener('cancel'"), 'search: Escape closes through the native dialog cancel interaction')
  assert(siteSearchSource.includes("event.key !== 'Tab'"), 'search: dialog handles forward and reverse keyboard focus wrapping')
  assert(siteSearchSource.includes('previousFocus.focus()'), 'search: closing restores focus to the opening trigger')
  assert(!/\b(?:gtag|fbq|sendBeacon|fetch)\b/.test(siteSearchIntentsSource), 'search: intent classifier is a local pure-data utility with no transport')

  const searchAnalyticsFunctions = siteSearchSource.match(/  function analyticsAllowed\(\)[\s\S]*?(?=\n  function loadPagefind\(\))/)?.[0] || ''
  assert(Boolean(searchAnalyticsFunctions), 'search: consent-gated analytics functions remain executable as one reviewed unit')
  if (searchAnalyticsFunctions) {
    function executeServiceSelection(analyticsConsent, attempts = 1) {
      const events = []
      const publishedIntent = searchIntents.classify('my computer shows a ransomware warning')
      const context = {
        intentApi: searchIntents,
        reportedEvents: {},
        window: {
          location: { pathname: '/' },
          nakedTechTracking: {
            getPreferences: () => ({ analytics: analyticsConsent }),
          },
          gtag: (...event) => events.push(event),
        },
      }
      vm.runInNewContext(`${searchAnalyticsFunctions}\nfor (var attempt = 0; attempt < ${attempts}; attempt += 1) { recordServiceSelection(publishedIntent, 'homepage') }`, {
        ...context,
        publishedIntent,
      })
      return events
    }

    const rejectedSelectionEvents = executeServiceSelection(false)
    assert(rejectedSelectionEvents.length === 0, 'search: published-service selection emits no analytics event without consent')

    const acceptedSelectionEvents = executeServiceSelection(true, 2)
    assert(acceptedSelectionEvents.length === 1, 'search: repeated published-service selection emits one consented event per destination')
    const acceptedSelection = acceptedSelectionEvents[0] || []
    assert(acceptedSelection[0] === 'event' && acceptedSelection[1] === 'site_search_service_select', 'search: consented published-service selection emits the approved GA4 event')
    assert(
      Object.keys(acceptedSelection[2] || {}).sort().join('|') === 'destination_path|intent_category|page_path|result_state|search_source',
      'search: executed service-selection event contains only five reviewed bounded fields'
    )
    assert(!JSON.stringify(acceptedSelection).includes('my computer shows a ransomware warning'), 'search: executed service-selection event excludes the typed query')
  }
}
const builtStyles = readFileSync(join(root, 'css', 'styles.css'), 'utf8')
assert(builtStyles.includes('site-search-backdrop-in'), 'search: built styles include the opening backdrop transition')
assert(builtStyles.includes('site-search-backdrop-out'), 'search: built styles include the closing backdrop transition')

const expectedSearchIntentCategories = [
  'account_recovery',
  'backup_setup',
  'data_recovery',
  'digital_services_help',
  'hardware_repair',
  'mobile_setup',
  'security_camera',
  'virus_malware',
]
assert(
  searchIntents.list().map((intent) => intent.category).sort().join('|') === expectedSearchIntentCategories.join('|'),
  'search: intent classifier exposes only the eight reviewed demand categories'
)
for (const [query, expectedCategory] of [
  ['virus', 'virus_malware'],
  ['ransomware warning', 'virus_malware'],
  ['set up my backup', 'backup_setup'],
  ['Time Machine backup help', 'backup_setup'],
  ['new iPhone setup', 'mobile_setup'],
  ['move my photos to a new phone', 'mobile_setup'],
  ['recover my deleted photos', 'data_recovery'],
  ["my laptop won't turn on", 'hardware_repair'],
  ['laptop not turning on', 'hardware_repair'],
  ['broken screen', 'hardware_repair'],
  ['broken screens', 'hardware_repair'],
  ['my Google account is locked', 'account_recovery'],
  ['locked account recovery', 'account_recovery'],
  ['help with myGov', 'digital_services_help'],
  ['security camera installation', 'security_camera'],
]) {
  assert(searchIntents.classify(query)?.category === expectedCategory, `search: “${query}” maps locally to ${expectedCategory}`)
}
for (const [query, expectedPath] of [
  ['virus', '/services/virus-malware-help-ivanhoe/'],
  ['set up my backup', '/services/backup-setup-ivanhoe/'],
  ['new iPhone setup', '/services/phone-tablet-setup-migration-ivanhoe/'],
  ['Android to iPhone', '/services/phone-tablet-setup-migration-ivanhoe/'],
]) {
  const intent = searchIntents.classify(query)
  assert(intent?.resultState === 'published_service', `search: “${query}” is a published service rather than unmet demand`)
  assert(intent?.actionHref === expectedPath, `search: “${query}” routes directly to ${expectedPath}`)
}
for (const supportedQuery of [
  'internet keeps dropping',
  'printer setup on my phone',
  'new computer transfer',
  'forgotten passwords',
  'I think I have been scammed',
]) {
  assert(searchIntents.classify(supportedQuery) === null, `search: supported query remains available to Pagefind (${supportedQuery})`)
}
const sampleUnmetIntent = searchIntents.classify('recover my deleted photos')
const samplePublishedIntent = searchIntents.classify('virus')
const searchOutcomePayload = searchIntents.analyticsPayload(sampleUnmetIntent, 'homepage', null, '/')
const searchInterestPayload = searchIntents.analyticsPayload(sampleUnmetIntent, 'navigation', 'referral_request', '/services/')
const servicesSearchPayload = searchIntents.analyticsPayload(sampleUnmetIntent, 'services', null, '/services/')
const serviceSelectionPayload = searchIntents.serviceSelectionPayload(samplePublishedIntent, 'homepage', '/')
assert(
  Object.keys(searchOutcomePayload).sort().join('|') === 'intent_category|page_path|result_state|search_source',
  'search: outcome analytics payload contains only four reviewed bounded fields'
)
assert(
  Object.keys(searchInterestPayload).sort().join('|') === 'intent_category|interest_type|page_path|result_state|search_source',
  'search: interest analytics payload adds only the reviewed bounded interest type'
)
assert(
  Object.keys(serviceSelectionPayload).sort().join('|') === 'destination_path|intent_category|page_path|result_state|search_source',
  'search: service-selection analytics payload contains only five reviewed bounded fields'
)
assert(serviceSelectionPayload.destination_path === '/services/virus-malware-help-ivanhoe/', 'search: service-selection analytics uses the allowlisted destination path')
assert(servicesSearchPayload.search_source === 'services', 'search: services-page demand retains its bounded entry-point value')
assert(
  !Object.keys({ ...searchOutcomePayload, ...searchInterestPayload, ...serviceSelectionPayload }).some((key) => /query|term|text|excerpt/i.test(key)),
  'search: analytics payload has no field capable of carrying typed query content'
)
const homepageStructuredData = jsonLdBlocks(baseHtml)
assert(homepageStructuredData.length === 1, 'homepage: exactly one JSON-LD entity graph rendered')
if (homepageStructuredData.length === 1) {
  try {
    const homepageGraph = JSON.parse(homepageStructuredData[0])
    const graphNodes = homepageGraph['@graph'] || []
    const websiteNode = graphNodes.find((node) => node['@type'] === 'WebSite')
    const businessNode = graphNodes.find((node) => node['@type'] === 'LocalBusiness')

    assert(homepageGraph['@context'] === 'https://schema.org', 'homepage schema: Schema.org context rendered')
    assert(graphNodes.length === 2, 'homepage schema: graph contains only the website and business entities')
    assert(websiteNode?.['@id'] === 'https://nakedtech.au/#website', 'homepage schema: stable website entity identifier rendered')
    assert(websiteNode?.url === 'https://nakedtech.au/', 'homepage schema: website URL matches the canonical homepage')
    assert(websiteNode?.name === 'Naked Tech', 'homepage schema: preferred site name is Naked Tech')
    assert(websiteNode?.alternateName?.at(-1) === 'nakedtech.au', 'homepage schema: canonical domain is the site-name fallback')
    assert(websiteNode?.publisher?.['@id'] === 'https://nakedtech.au/#business', 'homepage schema: website publisher references the business entity')
    assert(businessNode?.['@id'] === 'https://nakedtech.au/#business', 'homepage schema: stable business entity identifier rendered')
    assert(businessNode?.name === 'Naked Tech', 'homepage schema: business name matches the visible brand')
    assert(businessNode?.legalName === 'Peter Reginald', 'homepage schema: verified operator name rendered')
    assert(businessNode?.taxID === '57 221 340 918', 'homepage schema: verified ABN rendered')
    assert(businessNode?.telephone === '+61 3 7068 5422', 'homepage schema: international business telephone rendered')
    assert(businessNode?.logo?.contentUrl === 'https://nakedtech.au/img/nakedtech-mark.png', 'homepage schema: crawlable square logo rendered')
    assert(businessNode?.logo?.width === 800 && businessNode?.logo?.height === 800, 'homepage schema: logo dimensions rendered')
    assert(businessNode?.address?.addressLocality === 'Ivanhoe', 'homepage schema: verified business locality rendered')
    assert(businessNode?.address?.postalCode === '3079', 'homepage schema: verified business postcode rendered')
    assert(
      businessNode?.areaServed?.map((area) => area.name).join('|') === 'Ivanhoe VIC 3079|Eaglemont VIC 3084',
      'homepage schema: verified service areas rendered'
    )
    assert(!businessNode?.sameAs, 'homepage schema: no unverified profile URLs are claimed')
    assert(!businessNode?.aggregateRating && !businessNode?.review, 'homepage schema: no unsupported ratings or reviews are claimed')
  } catch (error) {
    failures.push(`homepage schema: JSON-LD parses as JSON (${error.message})`)
  }
}
assert(baseHtml.includes('Naked Tech is operated by Peter Reginald, ABN 57 221 340 918'), 'homepage: business operator and ABN are visible')
assert(baseHtml.includes('a sole trader based in Ivanhoe and also trading as Digital Sanctum'), 'homepage: business location and trading-name relationship are visible')
assert(baseHtml.includes('In-home appointments are available in Ivanhoe and Eaglemont from Monday to Friday, 9am–5pm.'), 'homepage: service area and hours support the structured data')
assert(baseHtml.includes('03 7068 5422'), 'phone number present in header/nav')

const trackingConsentScript = inlineScript(baseHtml, 'data-tracking-consent-bootstrap')
assert(Boolean(trackingConsentScript), 'base layout renders the tracking-consent bootstrap')
assert((baseHtml.match(/<section\b[^>]*data-tracking-consent-banner/gi) || []).length === 1, 'base layout renders one tracking-choice banner')
assert((baseHtml.match(/<div\b[^>]*data-tracking-preferences-dialog/gi) || []).length === 1, 'base layout renders one tracking-preferences dialog')
assert(/<div\b[^>]*class=["'][^"']*\bhidden\b[^"']*["'][^>]*data-tracking-preferences-dialog[^>]*\bhidden\b/i.test(baseHtml), 'tracking-preferences dialog has CSS and HTML initial-hidden safeguards')
assert(countOccurrences(baseHtml, 'data-tracking-consent-controls') === 1, 'base layout renders one tracking-preferences controller')
assert((baseHtml.match(/<input\b[^>]*data-tracking-analytics/gi) || []).length === 1, 'tracking preferences provide a separate analytics choice')
assert((baseHtml.match(/<input\b[^>]*data-tracking-advertising/gi) || []).length === 1, 'tracking preferences provide a separate advertising choice')
assert(!/<script\b[^>]*\bsrc=["']https:\/\/www\.googletagmanager\.com\/gtag\/js/i.test(baseHtml), 'GA4 has no eager external script element')
assert(!/<script\b[^>]*\bsrc=["']https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js/i.test(baseHtml), 'Meta Pixel has no eager external script element')
assert(!baseHtml.includes('https://www.facebook.com/tr?'), 'Meta noscript tracking request is absent')
assert(!/<input\b[^>]*data-tracking-(?:analytics|advertising)[^>]*\bchecked\b/i.test(baseHtml), 'optional tracking choices are not preselected')

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8')
  const footerHtml = html.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || ''
  assert((footerHtml.match(/<button\b[^>]*data-tracking-preferences-open/gi) || []).length === 1, `${relative(root, htmlFile)}: footer exposes tracking preferences once`)
  assert(!/<script\b[^>]*\bsrc=["']https:\/\/(?:www\.googletagmanager\.com\/gtag\/js|connect\.facebook\.net\/en_US\/fbevents\.js)/i.test(html), `${relative(root, htmlFile)}: optional tracking providers are not eagerly loaded`)
  assert(!html.includes('https://www.facebook.com/tr?'), `${relative(root, htmlFile)}: no consent-bypassing Meta image request`)
}

function runTrackingConsentBootstrap(savedPreference) {
  const insertedScripts = []
  const storedValues = new Map()
  if (savedPreference !== undefined) {
    storedValues.set('nakedtech-tracking-consent-v1', savedPreference)
  }
  const documentObject = {
    createElement(tagName) {
      return { tagName, dataset: {} }
    },
    head: {
      appendChild(element) {
        insertedScripts.push(element)
      }
    }
  }
  const localStorageObject = {
    getItem(key) {
      return storedValues.has(key) ? storedValues.get(key) : null
    },
    setItem(key, value) {
      storedValues.set(key, value)
    }
  }
  const windowObject = {}
  vm.runInNewContext(trackingConsentScript, {
    window: windowObject,
    document: documentObject,
    localStorage: localStorageObject,
    encodeURIComponent
  })
  return { windowObject, insertedScripts, storedValues }
}

if (trackingConsentScript) {
  const firstVisit = runTrackingConsentBootstrap()
  assert(firstVisit.insertedScripts.length === 0, 'first visit makes no optional tracking-script request')
  assert(firstVisit.windowObject.nakedTechTracking.hasChoice() === false, 'first visit has no implied tracking choice')
  assert(
    JSON.stringify(firstVisit.windowObject.nakedTechTracking.getPreferences()) === JSON.stringify({ analytics: false, advertising: false }),
    'first visit defaults both optional categories to off'
  )
  firstVisit.windowObject.gtag('event', 'before_consent')
  firstVisit.windowObject.fbq('track', 'BeforeConsent')
  firstVisit.windowObject.nakedTechTracking.setPreferences({ analytics: true, advertising: false })
  assert(firstVisit.insertedScripts.length === 1, 'analytics-only consent inserts one provider script')
  assert(firstVisit.insertedScripts[0]?.dataset?.trackingProvider === 'analytics', 'analytics-only consent loads only GA4')
  assert(firstVisit.insertedScripts[0]?.src === 'https://www.googletagmanager.com/gtag/js?id=G-6RN5LVVSGL', 'analytics-only consent loads the approved GA4 property')
  assert(
    firstVisit.windowObject.dataLayer.some((entry) => entry[0] === 'event' && entry[1] === 'before_consent'),
    'analytics event queued before consent is replayed only after analytics opt-in'
  )
  assert(
    JSON.parse(firstVisit.storedValues.get('nakedtech-tracking-consent-v1')).advertising === false,
    'analytics-only choice persists advertising as off'
  )

  const advertisingOnly = runTrackingConsentBootstrap()
  advertisingOnly.windowObject.fbq('trackCustom', 'DeferredAdvertisingEvent')
  advertisingOnly.windowObject.nakedTechTracking.setPreferences({ analytics: false, advertising: true })
  assert(advertisingOnly.insertedScripts.length === 1, 'advertising-only consent inserts one provider script')
  assert(advertisingOnly.insertedScripts[0]?.dataset?.trackingProvider === 'advertising', 'advertising-only consent loads only Meta Pixel')
  assert(advertisingOnly.insertedScripts[0]?.src === 'https://connect.facebook.net/en_US/fbevents.js', 'advertising-only consent loads the approved Meta provider')
  assert(
    advertisingOnly.windowObject.fbq.queue.some((entry) => entry[0] === 'trackCustom' && entry[1] === 'DeferredAdvertisingEvent'),
    'advertising event queued before consent is replayed only after advertising opt-in'
  )

  const rejected = runTrackingConsentBootstrap()
  rejected.windowObject.nakedTechTracking.setPreferences({ analytics: false, advertising: false })
  assert(rejected.insertedScripts.length === 0, 'rejecting optional tracking loads no provider scripts')
  assert(rejected.windowObject.nakedTechTracking.hasChoice() === true, 'rejection is stored as an explicit choice')

  const savedAnalytics = runTrackingConsentBootstrap(JSON.stringify({
    version: 1,
    analytics: true,
    advertising: false
  }))
  assert(savedAnalytics.insertedScripts.length === 1, 'saved analytics consent is restored on the next page')
  assert(savedAnalytics.insertedScripts[0]?.dataset?.trackingProvider === 'analytics', 'saved analytics consent does not enable advertising')

  const outdatedChoice = runTrackingConsentBootstrap(JSON.stringify({
    version: 0,
    analytics: true,
    advertising: true
  }))
  assert(outdatedChoice.insertedScripts.length === 0, 'outdated consent record does not load providers')
  assert(outdatedChoice.windowObject.nakedTechTracking.hasChoice() === false, 'outdated consent record prompts for a fresh choice')
}
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
  '/services/email-help-ivanhoe/',
  '/services/new-printer-setup-ivanhoe/'
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
assert(
  countOccurrences(baseHtml, 'href="/services/new-printer-setup-ivanhoe/"') >= 4,
  'navigation and footer: new-printer route is available on desktop, mobile and the homepage'
)
assert(baseHtml.includes('HELP WITH'), 'navigation: desktop problem menu rendered')
assert(baseHtml.includes('aria-label="Navigation menu"'), 'navigation: mobile menu control rendered')
for (const groupedNavId of ['desktop-nav-fix-heading', 'desktop-nav-setup-heading', 'mobile-nav-fix-heading', 'mobile-nav-setup-heading']) {
  assert(countOccurrences(baseHtml, `id="${groupedNavId}"`) === 1, `navigation: grouped menu heading ${groupedNavId} rendered once`)
}
assert(baseHtml.includes('data-navigation-disclosures'), 'navigation: disclosure behaviour rendered')
assert(baseHtml.includes('SERVICES &amp; PRICING'), 'navigation: services and pricing link rendered')
assert(baseHtml.includes('href="#how-it-works"'), 'homepage navigation: how-it-works link targets local overview')
assert(baseHtml.includes('data-theme-bootstrap'), 'theme: no-flash bootstrap rendered')
assert(baseHtml.indexOf('data-theme-bootstrap') < baseHtml.indexOf('href="/css/styles.css"'), 'theme: bootstrap runs before stylesheet')
assert(baseHtml.includes('data-theme-controls'), 'theme: persistent controls rendered')
for (const choice of ['system', 'light', 'dark']) {
  assert(baseHtml.includes(`data-theme-choice="${choice}"`), `theme: ${choice} choice rendered`)
}
assert(baseHtml.includes('aria-label="Find technology help"'), 'footer: grouped help navigation rendered')
assert(baseHtml.includes('aria-label="Explore Naked Tech"'), 'footer: concise Explore navigation rendered')
assert(baseHtml.includes('aria-label="Legal and site information"'), 'footer: legal and utility navigation rendered')
assert(countOccurrences(baseHtml, 'id="footer-fix-heading"') === 1, 'footer: problem-solving links have one group heading')
assert(countOccurrences(baseHtml, 'id="footer-setup-heading"') === 1, 'footer: setup links have one group heading')
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
  assert(countOccurrences(componentHtml, 'data-contact-collection-notice') === 1, 'contact-form fixture renders one point-of-collection notice')
  assert(/<details\b(?![^>]*\bopen\b)[^>]*data-contact-collection-notice/i.test(componentHtml), 'contact-form fixture keeps detailed collection information collapsed by default')
  assert(countOccurrences(componentHtml, 'data-pagefind-ignore') === 1, 'contact-form fixture excludes repeated enquiry boilerplate from site-search excerpts')
  assert(componentHtml.indexOf('data-contact-collection-notice') < componentHtml.indexOf('data-contact-form-frame'), 'contact-form fixture renders notice before form fields')
  assert(componentHtml.includes('Fields marked with an asterisk are required'), 'contact-form fixture explains required and optional fields')
  assert(componentHtml.includes('unfinished answers are saved in this browser’s local storage'), 'contact-form fixture discloses local draft storage')
  assert(
    componentHtml.includes('campaign parameters are attached only with Analytics enabled') &&
      componentHtml.includes('advertising click identifiers only with Advertising enabled'),
    'contact-form fixture discloses consent-gated campaign context'
  )
  assert(componentHtml.includes('An enquiry is not a marketing signup.'), 'contact-form fixture sets the direct-marketing boundary')
  assert(componentHtml.includes('href="/privacy/"'), 'contact-form fixture links the full Privacy Policy')
  assert(!componentHtml.includes('will never be shared or sold'), 'contact-form fixture omits the inaccurate absolute sharing promise')
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
      nakedTechTracking: {
        getSnapshot() {
          return { analytics: 'granted', advertising: 'granted' }
        },
        subscribe() {
          return () => {}
        }
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
      assert(sentContext.schema_version === 2, 'fallback form context uses the privacy-aware schema')
      assert(sentContext.analytics_consent === 'granted', 'fallback form context records current Analytics consent')
      assert(sentContext.advertising_consent === 'granted', 'fallback form context records current Advertising consent')
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

      const completion = {
        type: 'sanctum-forms:submitted',
        version: 1,
        submission_id: '323e4567-e89b-42d3-a456-426614174000',
        correlation_id: '123e4567-e89b-42d3-a456-426614174000',
        lead_event_id: 'sf-lead-323e4567-e89b-42d3-a456-426614174000',
        analytics_consent: 'granted',
        advertising_consent: 'granted'
      }
      dispatch(completion, 'https://attacker.example')
      dispatch(completion)
      dispatch(completion)

      const metaLeadCalls = fbqCalls.filter((call) => call[0] === 'track' && call[1] === 'Lead')
      const gaLeadCalls = gtagCalls.filter((call) => call[0] === 'event' && call[1] === 'generate_lead')
      assert(metaLeadCalls.length === 1, 'one trusted repeated submission produces exactly one Meta Lead')
      assert(gaLeadCalls.length === 1, 'one trusted repeated submission produces exactly one GA4 generate_lead')
      assert(metaLeadCalls[0]?.[2]?.pain_point === formProps.painPoint, 'Meta Lead includes pain-point context')
      assert(metaLeadCalls[0]?.[2]?.page_path === '/__fixtures__/contact-form/', 'Meta Lead includes page-path context')
      assert(gaLeadCalls[0]?.[2]?.pain_point === formProps.painPoint, 'GA4 generate_lead includes pain-point context')
      assert(gaLeadCalls[0]?.[2]?.page_path === '/__fixtures__/contact-form/', 'GA4 generate_lead includes page-path context')
      assert(gaLeadCalls[0]?.[2]?.lead_event_id === completion.lead_event_id, 'GA4 generate_lead includes the server-issued lead event ID')
      assert(metaLeadCalls[0]?.[3]?.eventID === completion.lead_event_id, 'Meta Lead uses the server-issued deduplication ID')
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
assert(/<section\b[^>]*data-contact-form-root[^>]*data-pagefind-ignore/i.test(contactHtml), '/contact/: repeated enquiry section is excluded from site-search excerpts')
assert(countOccurrences(contactHtml, 'data-contact-collection-notice') === 1, '/contact/: point-of-collection notice renders once')
assert(/<details\b(?![^>]*\bopen\b)[^>]*data-contact-collection-notice/i.test(contactHtml), '/contact/: detailed collection information is collapsed by default')
assert(contactHtml.indexOf('data-contact-collection-notice') < contactHtml.indexOf('data-contact-form-frame'), '/contact/: collection notice appears before form fields')
assert(contactHtml.includes('href="/privacy/"'), '/contact/: collection notice links the Privacy Policy')
assert(!contactHtml.includes('will never be shared or sold'), '/contact/: inaccurate absolute data-sharing promise is absent')
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
