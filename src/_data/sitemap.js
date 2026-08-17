const { execFileSync } = require('node:child_process')
const { resolve } = require('node:path')

const serviceCatalogue = require('./serviceCatalogue.js')

const projectRoot = resolve(__dirname, '../..')

const routeDefinitions = [
  {
    path: '/',
    sources: ['src/index.njk', 'src/_data/problemServices.js', 'src/_data/services.js', 'src/_data/serviceCatalogue.js', 'src/_data/projectServices.json'],
  },
  {
    path: '/services/',
    sources: ['src/services.njk', 'src/_data/problemServices.js', 'src/_data/services.js', 'src/_data/serviceCatalogue.js', 'src/_data/projectServices.json'],
  },
  { path: '/contact/', sources: ['src/contact.njk', 'src/_includes/components/contact-form.njk'] },
  { path: '/toolkit/', sources: ['src/toolkit.njk'] },
  { path: '/legal/', sources: ['src/legal.njk'] },
  { path: '/service-terms/', sources: ['src/service-terms.njk'] },
  { path: '/terms/', sources: ['src/terms.njk'] },
  { path: '/privacy/', sources: ['src/privacy.njk'] },
  { path: '/brand/', sources: ['src/brand.njk'] },
]

const landingPageSourceByServiceKey = {
  wifi_dropouts: 'src/landing-pages/wifi-dropouts.njk',
  slow_computer: 'src/landing-pages/slow-computer-help.njk',
  scam_security: 'src/landing-pages/scam-security-help.njk',
  virus_malware: 'src/landing-pages/virus-malware-help.njk',
  new_computer_setup: 'src/landing-pages/new-computer-setup-data-transfer.njk',
  printer_help: 'src/landing-pages/printer-help.njk',
  email_help: 'src/landing-pages/email-help.njk',
  new_printer_setup: 'src/landing-pages/new-printer-setup.njk',
  backup_setup: 'src/landing-pages/backup-setup.njk',
  mobile_setup: 'src/landing-pages/phone-tablet-setup-migration.njk',
  password_safety_control: 'src/landing-pages/password-safety-control.njk',
}

function gitLastModified(sources) {
  const lastModified = execFileSync(
    'git',
    ['log', '-1', '--format=%cs', '--', ...sources],
    { cwd: projectRoot, encoding: 'utf8' },
  ).trim()

  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastModified)) {
    throw new Error(`Could not determine an accurate sitemap date for ${sources.join(', ')}`)
  }

  return lastModified
}

function serviceCatalogueLastModified(serviceKey) {
  const range = `/serviceKey: '${serviceKey}'/,/^  },$/:src/_data/serviceCatalogue.js`
  const lastModified = execFileSync(
    'git',
    ['log', '-1', '--format=%cs', '-L', range],
    { cwd: projectRoot, encoding: 'utf8' },
  ).trim().split('\n')[0]

  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastModified)) {
    throw new Error(`Could not determine an accurate catalogue date for ${serviceKey}`)
  }

  return lastModified
}

function newestDate(...dates) {
  return dates.sort().at(-1)
}

function serviceSources(service) {
  const landingPageSource = landingPageSourceByServiceKey[service.serviceKey]
  if (landingPageSource) {
    return [landingPageSource, 'src/_includes/layouts/sales-landing-page.njk']
  }

  return ['src/service-detail.njk', 'src/_data/services.js', 'src/_data/projectServices.json']
}

module.exports = {
  routes: routeDefinitions.map(({ path, sources }) => ({
    path,
    lastModified: gitLastModified(sources),
  })),
  services: serviceCatalogue.services.map((service) => ({
    canonicalUrl: service.canonicalUrl,
    lastModified: newestDate(
      gitLastModified(serviceSources(service)),
      serviceCatalogueLastModified(service.serviceKey),
    ),
  })),
}
