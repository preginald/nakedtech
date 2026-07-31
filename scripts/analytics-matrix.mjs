import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'

const siteRoot = new URL('../_site/', import.meta.url).pathname
const formsOrigin = 'https://forms.digitalsanctum.com.au'
const campaignQuery = 'utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01'
const checks = []
const rows = []

const routes = [
  {
    label: 'Wi-Fi',
    route: '/services/wifi-dropouts-ivanhoe/',
    painPoint: 'wifi_dropouts',
    campaignContent: 'wifi_dropouts_v1'
  },
  {
    label: 'Slow computer',
    route: '/services/slow-computer-help-ivanhoe/',
    painPoint: 'slow_computer',
    campaignContent: 'slow_computer_v1'
  },
  {
    label: 'Scam security',
    route: '/services/scam-security-help-ivanhoe/',
    painPoint: 'scam_security',
    campaignContent: 'scam_security_v1'
  }
]

function routeToFile(route) {
  return join(siteRoot, route.replace(/^\/+|\/+$/g, ''), 'index.html')
}

function routeHtml(route) {
  const file = routeToFile(route)
  if (!existsSync(file)) {
    throw new Error(`Generated route is missing: ${route}. Run npm run build first.`)
  }
  return readFileSync(file, 'utf8')
}

function inlineScript(html, marker) {
  return html.match(new RegExp(`<script[^>]*${marker}[^>]*>([\\s\\S]*?)<\\/script>`, 'i'))?.[1]
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
  checks.push(message)
}

function assertExactContext(actual, expected, message) {
  const actualJson = JSON.stringify(actual, Object.keys(actual || {}).sort())
  const expectedJson = JSON.stringify(expected, Object.keys(expected).sort())
  assert(actualJson === expectedJson, `${message}: expected ${expectedJson}, observed ${actualJson}`)
}

function matchingCalls(calls, platform, eventName) {
  if (platform === 'GA4') {
    return calls.filter((call) => call[0] === 'event' && call[1] === eventName)
  }
  return calls.filter((call) => call[0] === 'track' && call[1] === eventName)
}

function assertSingleEvent(calls, platform, eventName, expectedContext, label) {
  const matches = matchingCalls(calls, platform, eventName)
  assert(matches.length === 1, `${label}: ${platform} ${eventName} fires exactly once`)
  assertExactContext(matches[0]?.[2], expectedContext, `${label}: ${platform} ${eventName} context matches`)
  return matches[0][2]
}

function runPageView(route, search) {
  const script = inlineScript(routeHtml(route.route), 'data-pain-page-view-tracking')
  assert(Boolean(script), `${route.label}: generated page-view tracking script exists`)

  const fbqCalls = []
  const gtagCalls = []
  vm.runInNewContext(script, {
    window: { location: { pathname: route.route, search } },
    URLSearchParams,
    fbq: (...args) => fbqCalls.push(args),
    gtag: (...args) => gtagCalls.push(args)
  })

  return { fbqCalls, gtagCalls }
}

function runPhoneClick(route) {
  const script = inlineScript(routeHtml(route.route), 'data-phone-click-tracking')
  assert(Boolean(script), `${route.label}: generated telephone tracking script exists`)

  const clickHandlers = []
  const fbqCalls = []
  const gtagCalls = []
  const phoneLink = { href: 'tel:+61370685422' }
  const documentObject = {
    body: { dataset: { painPoint: route.painPoint } },
    addEventListener(type, handler) {
      if (type === 'click') clickHandlers.push(handler)
    }
  }

  vm.runInNewContext(script, {
    window: { location: { pathname: route.route } },
    document: documentObject,
    fbq: (...args) => fbqCalls.push(args),
    gtag: (...args) => gtagCalls.push(args)
  })

  assert(clickHandlers.length === 1, `${route.label}: exactly one delegated telephone listener is installed`)
  clickHandlers[0]({ target: { closest: () => phoneLink } })
  clickHandlers[0]({ target: { closest: () => null } })

  return { fbqCalls, gtagCalls }
}

function runFormFlow(route, search) {
  const script = inlineScript(routeHtml(route.route), 'data-contact-form-tracking')
  assert(Boolean(script), `${route.label}: generated form tracking script exists`)

  const messageHandlers = []
  const contextMessages = []
  const fbqCalls = []
  const gtagCalls = []
  const iframeWindow = {
    postMessage(message, targetOrigin) {
      contextMessages.push({ message, targetOrigin })
    }
  }
  const iframe = { contentWindow: iframeWindow, style: {} }
  const root = {
    dataset: { painPoint: route.painPoint },
    querySelector(selector) {
      return selector === '[data-contact-form-frame]' ? iframe : null
    }
  }

  vm.runInNewContext(script, {
    window: {
      location: { pathname: route.route, search },
      addEventListener(type, handler) {
        if (type === 'message') messageHandlers.push(handler)
      }
    },
    document: { currentScript: { previousElementSibling: root } },
    URLSearchParams,
    fbq: (...args) => fbqCalls.push(args),
    gtag: (...args) => gtagCalls.push(args)
  })

  assert(messageHandlers.length === 1, `${route.label}: exactly one form message listener is installed`)
  const dispatch = (data, origin = formsOrigin, source = iframeWindow) => {
    messageHandlers[0]({ data, origin, source })
  }

  dispatch({ type: 'sanctum-forms:ready', version: 1 }, 'https://attacker.example')
  dispatch({ type: 'sanctum-forms:ready', version: 1 }, formsOrigin, {})
  dispatch({ type: 'sanctum-forms:ready', version: 1 })
  dispatch({ type: 'sanctum-forms:ready', version: 1 })

  dispatch({ type: 'sanctum-forms:started', version: 1 }, 'https://attacker.example')
  dispatch({ type: 'sanctum-forms:started', version: 1 }, formsOrigin, {})
  dispatch({ type: 'sanctum-forms:started', version: 1 })
  dispatch({ type: 'sanctum-forms:started', version: 1 })

  dispatch({ type: 'sanctum-forms:resize', height: 720 })
  dispatch({ type: 'sanctum-forms:resize', height: 900 }, 'https://attacker.example')
  dispatch({ type: 'sanctum-forms:resize', height: 900 }, formsOrigin, {})
  dispatch({ type: 'sanctum-forms:resize', height: '900' })

  dispatch({ type: 'sanctum-forms:submitted', version: 1 }, 'https://attacker.example')
  dispatch({ type: 'sanctum-forms:submitted', version: 1 }, formsOrigin, {})
  dispatch({ type: 'sanctum-forms:submitted', version: 1 })
  dispatch({ type: 'sanctum-forms:submitted', version: 1 })

  return { contextMessages, fbqCalls, gtagCalls, iframe }
}

for (const route of routes) {
  const paidSearch = `?${campaignQuery}&utm_content=${route.campaignContent}&utm_term=ignored&unknown=ignored`
  const paidContext = {
    pain_point: route.painPoint,
    page_path: route.route,
    campaign_content: route.campaignContent
  }
  const actionContext = {
    pain_point: route.painPoint,
    page_path: route.route
  }

  const paidView = runPageView(route, paidSearch)
  const paidGaContext = assertSingleEvent(
    paidView.gtagCalls,
    'GA4',
    'view_service',
    paidContext,
    `${route.label} paid page view`
  )
  const paidMetaContext = assertSingleEvent(
    paidView.fbqCalls,
    'Meta',
    'ViewContent',
    paidContext,
    `${route.label} paid page view`
  )
  rows.push({
    case: `${route.label} paid page view`,
    ga4: `view_service ×1 ${JSON.stringify(paidGaContext)}`,
    meta: `ViewContent ×1 ${JSON.stringify(paidMetaContext)}`
  })

  const directView = runPageView(route, '')
  const directGaContext = assertSingleEvent(
    directView.gtagCalls,
    'GA4',
    'view_service',
    actionContext,
    `${route.label} direct/organic page view`
  )
  const directMetaContext = assertSingleEvent(
    directView.fbqCalls,
    'Meta',
    'ViewContent',
    actionContext,
    `${route.label} direct/organic page view`
  )
  rows.push({
    case: `${route.label} direct/organic page view`,
    ga4: `view_service ×1 ${JSON.stringify(directGaContext)}`,
    meta: `ViewContent ×1 ${JSON.stringify(directMetaContext)}`
  })

  const phone = runPhoneClick(route)
  const phoneGaContext = assertSingleEvent(
    phone.gtagCalls,
    'GA4',
    'phone_click',
    actionContext,
    `${route.label} telephone activation`
  )
  const phoneMetaContext = assertSingleEvent(
    phone.fbqCalls,
    'Meta',
    'Contact',
    actionContext,
    `${route.label} telephone activation`
  )
  rows.push({
    case: `${route.label} telephone activation`,
    ga4: `phone_click ×1 ${JSON.stringify(phoneGaContext)}`,
    meta: `Contact ×1 ${JSON.stringify(phoneMetaContext)}`
  })

  const form = runFormFlow(route, paidSearch)
  assert(form.contextMessages.length === 1, `${route.label}: repeated trusted ready messages send context exactly once`)
  assert(form.contextMessages[0]?.targetOrigin === formsOrigin, `${route.label}: form context targets the exact Forms origin`)
  assert(form.contextMessages[0]?.message?.type === 'sanctum-forms:context', `${route.label}: form context uses the protocol v1 message type`)
  assert(form.contextMessages[0]?.message?.version === 1, `${route.label}: form context uses protocol version 1`)
  const expectedFormContext = {
    pain_point: route.painPoint,
    page_path: route.route,
    utm_source: 'facebook',
    utm_medium: 'paid_social',
    utm_campaign: 'naked_tech_pain_points_01',
    utm_content: route.campaignContent
  }
  const observedFormContext = form.contextMessages[0]?.message?.context
  assertExactContext(observedFormContext, expectedFormContext, `${route.label}: form context allowlists the complete campaign attribution`)
  rows.push({
    case: `${route.label} form-context handshake`,
    ga4: 'No analytics event expected',
    meta: 'No analytics event expected',
    protocol: `Forms context ×1 ${JSON.stringify(observedFormContext)}`
  })

  const formStartGaContext = assertSingleEvent(
    form.gtagCalls,
    'GA4',
    'form_start',
    actionContext,
    `${route.label} first form interaction`
  )
  assert(matchingCalls(form.fbqCalls, 'Meta', 'form_start').length === 0, `${route.label}: Meta receives no form-start event`)
  rows.push({
    case: `${route.label} first form interaction`,
    ga4: `form_start ×1 ${JSON.stringify(formStartGaContext)}`,
    meta: 'None ×0'
  })

  const leadGaContext = assertSingleEvent(
    form.gtagCalls,
    'GA4',
    'generate_lead',
    actionContext,
    `${route.label} successful form submission`
  )
  const leadMetaContext = assertSingleEvent(
    form.fbqCalls,
    'Meta',
    'Lead',
    actionContext,
    `${route.label} successful form submission`
  )
  assert(form.iframe.style.height === '720px', `${route.label}: invalid and untrusted resize probes do not replace the trusted height`)
  rows.push({
    case: `${route.label} successful form submission`,
    ga4: `generate_lead ×1 ${JSON.stringify(leadGaContext)}`,
    meta: `Lead ×1 ${JSON.stringify(leadMetaContext)}`
  })
  rows.push({
    case: `${route.label} replay/trust-boundary controls`,
    ga4: 'Valid repeated start/submission messages remain ×1; rejected messages add ×0',
    meta: 'Valid repeated submission remains ×1; rejected messages add ×0'
  })
}

console.log(`P4-T1 analytics matrix passed: ${rows.length} scenarios, ${checks.length} assertions.`)
for (const row of rows) {
  console.log(`\n${row.case}`)
  console.log(`  GA4: ${row.ga4}`)
  console.log(`  Meta: ${row.meta}`)
  if (row.protocol) console.log(`  Protocol: ${row.protocol}`)
}
console.log('\nEvidence scope: deterministic local execution of the generated parent-page scripts with analytics calls intercepted; no production event, provider submission, or analytics-platform state was mutated.')
