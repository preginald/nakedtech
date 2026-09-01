import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'

const siteRoot = new URL('../_site/', import.meta.url).pathname
const formsOrigin = 'https://forms.digitalsanctum.com.au'
const correlationId = '123e4567-e89b-42d3-a456-426614174000'
const submissionId = '323e4567-e89b-42d3-a456-426614174000'
const leadEventId = `sf-lead-${submissionId}`
const approvedCampaignAttribution = {
  utm_source: 'facebook',
  utm_medium: 'paid_social',
  utm_campaign: 'naked_tech_pain_points_01'
}
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
  },
  {
    label: 'Virus and malware',
    route: '/services/virus-malware-help-ivanhoe/',
    painPoint: 'virus_malware',
    campaignContent: 'virus_malware_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'New computer setup',
    route: '/services/new-computer-setup-data-transfer-ivanhoe/',
    painPoint: 'new_computer_setup',
    campaignContent: 'new_computer_setup_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'Printer help',
    route: '/services/printer-help-ivanhoe/',
    painPoint: 'printer_help',
    campaignContent: 'printer_help_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'Email help',
    route: '/services/email-help-ivanhoe/',
    painPoint: 'email_help',
    campaignContent: 'email_help_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'New printer setup',
    route: '/services/new-printer-setup-ivanhoe/',
    painPoint: 'new_printer_setup',
    campaignContent: 'new_printer_setup_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'Password safety and control',
    route: '/services/password-manager-setup-ivanhoe/',
    painPoint: 'password_safety_control',
    campaignContent: 'password_safety_control_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'Backup setup',
    route: '/services/backup-setup-ivanhoe/',
    painPoint: 'backup_setup',
    campaignContent: 'backup_setup_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
  },
  {
    label: 'Phone and tablet setup',
    route: '/services/phone-tablet-setup-migration-ivanhoe/',
    painPoint: 'mobile_setup',
    campaignContent: 'mobile_setup_audit_only',
    attributedCase: 'synthetic attributed page view',
    attribution: {
      utm_source: 'site_audit',
      utm_medium: 'test',
      utm_campaign: 'non_live_validation'
    }
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

function runFormFlow(route, search, consent = { analytics: 'granted', advertising: 'granted' }) {
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
  const consentListeners = []
  const consentAvailable = consent.analytics !== 'unavailable' && consent.advertising !== 'unavailable'
  let consentState = {
    ...consent,
    recorded_at: consentAvailable ? '2026-09-01T04:00:02.000Z' : null,
    source: consentAvailable ? 'nakedtech_tracking_preferences_v1' : 'unavailable'
  }
  const params = new URLSearchParams(search)
  const journey = {
    getCorrelationId: () => correlationId,
    getContext(painPoint) {
      const context = {
        schema_version: 2,
        correlation_id: correlationId,
        landing_observed_at: '2026-09-01T04:00:00.000Z',
        landing_url: `https://nakedtech.au${route.route}`,
        landing_path: route.route,
        page_path: route.route,
        pain_point: painPoint,
        analytics_consent: consentState.analytics,
        advertising_consent: consentState.advertising,
        consent_recorded_at: consentState.recorded_at,
        consent_source: consentState.source,
        operational_basis: 'service_request',
        marketing_basis: consentState.analytics === 'granted' || consentState.advertising === 'granted'
          ? 'consent' : 'not_collected',
        client_clock: 'browser',
        client_storage_state: 'available',
        referrer_state: 'missing'
      }
      for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']) {
        const value = params.get(key)
        if (!value) context[`${key}_state`] = 'missing'
        else if (consentState.analytics !== 'granted') context[`${key}_state`] = 'withheld_no_consent'
        else {
          context[`${key}_state`] = 'present'
          context[key] = value
        }
      }
      for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid']) {
        const value = params.get(key)
        if (!value) context[`${key}_state`] = 'missing'
        else if (consentState.advertising !== 'granted') context[`${key}_state`] = 'withheld_no_consent'
        else {
          context[`${key}_state`] = 'present'
          context[key] = value
        }
      }
      return context
    }
  }
  const tracking = {
    getSnapshot: () => ({ ...consentState }),
    subscribe(listener) {
      consentListeners.push(listener)
      return () => {}
    }
  }

  vm.runInNewContext(script, {
    window: {
      location: { pathname: route.route, search },
      nakedTechLeadJourney: journey,
      nakedTechTracking: tracking,
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

  const completion = {
    type: 'sanctum-forms:submitted',
    version: 1,
    submission_id: submissionId,
    correlation_id: correlationId,
    lead_event_id: leadEventId,
    occurred_at: '2026-09-01T04:01:00.000Z',
    analytics_consent: consentState.analytics,
    advertising_consent: consentState.advertising
  }
  dispatch(completion, 'https://attacker.example')
  dispatch(completion, formsOrigin, {})
  dispatch({ ...completion, lead_event_id: 'malformed' })
  dispatch(completion)
  dispatch(completion)

  return { contextMessages, fbqCalls, gtagCalls, iframe }
}

function runLeadJourneyBootstrap(
  route,
  search,
  referrer = 'https://www.facebook.com/paid/campaign?private=drop',
  retainedState = {}
) {
  const html = routeHtml(route.route)
  const consentScript = inlineScript(html, 'data-tracking-consent-bootstrap')
  const journeyScript = inlineScript(html, 'data-lead-correlation-bootstrap')
  assert(Boolean(consentScript), `${route.label}: tracking-consent bootstrap exists`)
  assert(Boolean(journeyScript), `${route.label}: lead-correlation bootstrap exists`)

  const localValues = retainedState.localValues || new Map()
  const sessionValues = retainedState.sessionValues || new Map()
  const localStorage = {
    getItem: key => localValues.get(key) ?? null,
    setItem: (key, value) => localValues.set(key, value)
  }
  const sessionStorage = {
    getItem: key => sessionValues.get(key) ?? null,
    setItem: (key, value) => sessionValues.set(key, value)
  }
  const windowObject = {
    location: {
      origin: 'https://nakedtech.au',
      href: `https://nakedtech.au${route.route}${search}`,
      pathname: route.route,
      search
    },
    crypto: { randomUUID: () => correlationId },
    dataLayer: []
  }
  const documentObject = {
    referrer,
    head: { appendChild() {} },
    createElement: () => ({ dataset: {} })
  }
  const runtime = {
    window: windowObject,
    document: documentObject,
    localStorage,
    sessionStorage,
    URL,
    URLSearchParams,
    Uint8Array,
    Date,
    Number,
    Array,
    JSON,
    encodeURIComponent
  }
  vm.runInNewContext(consentScript, runtime)
  vm.runInNewContext(journeyScript, runtime)

  const initial = windowObject.nakedTechLeadJourney.getContext(route.painPoint)
  const initiallyStored = sessionValues.get('nakedtech-lead-journey-v1')
  windowObject.nakedTechTracking.setPreferences({ analytics: true, advertising: false })
  const analyticsGranted = windowObject.nakedTechLeadJourney.getContext(route.painPoint)
  windowObject.nakedTechTracking.setPreferences({ analytics: true, advertising: true })
  const allGranted = windowObject.nakedTechLeadJourney.getContext(route.painPoint)
  return { initial, unavailable: initial, initiallyStored, analyticsGranted, allGranted, localValues, sessionValues }
}

const journeyProbe = runLeadJourneyBootstrap(
  routes[0],
  `?${new URLSearchParams({
    ...approvedCampaignAttribution,
    utm_content: routes[0].campaignContent,
    fbclid: 'IwAR_test_click_id'
  })}`
)
assert(journeyProbe.unavailable.correlation_id === correlationId, 'lead journey: secure correlation ID is stable')
assert(journeyProbe.unavailable.analytics_consent === 'unavailable', 'lead journey: absent choice is explicit')
assert(journeyProbe.unavailable.client_storage_state === 'available', 'lead journey: client storage availability is explicit')
assert(journeyProbe.unavailable.utm_source_state === 'withheld_no_consent', 'lead journey: UTM is withheld before consent')
assert(journeyProbe.unavailable.fbclid_state === 'withheld_no_consent', 'lead journey: click ID is withheld before consent')
assert(!journeyProbe.initiallyStored.includes('facebook'), 'lead journey: raw UTM value is not stored before consent')
assert(!journeyProbe.initiallyStored.includes('IwAR_test_click_id'), 'lead journey: raw click ID is not stored before consent')
assert(journeyProbe.analyticsGranted.utm_source === 'facebook', 'lead journey: Analytics consent releases bounded UTM context')
assert(journeyProbe.analyticsGranted.referrer === 'https://www.facebook.com', 'lead journey: external referrer is reduced to its origin')
assert(!Object.prototype.hasOwnProperty.call(journeyProbe.analyticsGranted, 'fbclid'), 'lead journey: advertising ID remains withheld')
assert(journeyProbe.allGranted.fbclid === 'IwAR_test_click_id', 'lead journey: Advertising consent releases bounded click ID')
const hostilePrefixProbe = runLeadJourneyBootstrap(
  routes[0],
  '',
  'https://nakedtech.au.attacker.example/private/path?secret=drop'
)
assert(
  hostilePrefixProbe.analyticsGranted.referrer === 'https://nakedtech.au.attacker.example',
  'lead journey: a hostname-prefix lookalike is external and reduced to its origin'
)
const continuedJourneyProbe = runLeadJourneyBootstrap(
  routes[1],
  '',
  'https://nakedtech.au/services/wifi-dropouts-ivanhoe/',
  { localValues: journeyProbe.localValues, sessionValues: journeyProbe.sessionValues }
)
assert(continuedJourneyProbe.initial.correlation_id === correlationId, 'lead journey: correlation survives same-tab navigation')
assert(continuedJourneyProbe.initial.landing_path === routes[0].route, 'lead journey: original landing survives same-tab navigation')
assert(continuedJourneyProbe.initial.page_path === routes[1].route, 'lead journey: current form page follows same-tab navigation')
assert(continuedJourneyProbe.initial.utm_source === 'facebook', 'lead journey: consented landing attribution survives same-tab navigation')
assert(continuedJourneyProbe.initial.fbclid === 'IwAR_test_click_id', 'lead journey: consented click ID survives same-tab navigation')
rows.push({
  case: 'Lead-journey consent transitions',
  ga4: 'No analytics event expected',
  meta: 'No analytics event expected',
  protocol: 'unavailable → Analytics granted → Advertising granted; one stable correlation ID'
})

for (const route of routes) {
  const attribution = route.attribution || approvedCampaignAttribution
  const attributedCase = route.attributedCase || 'paid page view'
  const paidSearch = `?${new URLSearchParams({
    ...attribution,
    utm_content: route.campaignContent,
    fbclid: 'IwAR_test_click_id',
    utm_term: 'ignored',
    unknown: 'ignored'
  })}`
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
    `${route.label} ${attributedCase}`
  )
  const paidMetaContext = assertSingleEvent(
    paidView.fbqCalls,
    'Meta',
    'ViewContent',
    paidContext,
    `${route.label} ${attributedCase}`
  )
  rows.push({
    case: `${route.label} ${attributedCase}`,
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
    schema_version: 2,
    correlation_id: correlationId,
    landing_observed_at: '2026-09-01T04:00:00.000Z',
    landing_url: `https://nakedtech.au${route.route}`,
    landing_path: route.route,
    page_path: route.route,
    pain_point: route.painPoint,
    analytics_consent: 'granted',
    advertising_consent: 'granted',
    consent_recorded_at: '2026-09-01T04:00:02.000Z',
    consent_source: 'nakedtech_tracking_preferences_v1',
    operational_basis: 'service_request',
    marketing_basis: 'consent',
    client_clock: 'browser',
    client_storage_state: 'available',
    referrer_state: 'missing',
    utm_source_state: 'present',
    utm_source: attribution.utm_source,
    utm_medium_state: 'present',
    utm_medium: attribution.utm_medium,
    utm_campaign_state: 'present',
    utm_campaign: attribution.utm_campaign,
    utm_content_state: 'present',
    utm_content: route.campaignContent,
    gclid_state: 'missing',
    gbraid_state: 'missing',
    wbraid_state: 'missing',
    fbclid_state: 'present',
    fbclid: 'IwAR_test_click_id'
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
    { ...actionContext, lead_event_id: leadEventId },
    `${route.label} successful form submission`
  )
  const leadMetaContext = assertSingleEvent(
    form.fbqCalls,
    'Meta',
    'Lead',
    { ...actionContext, lead_event_id: leadEventId },
    `${route.label} successful form submission`
  )
  assert(form.iframe.style.height === '720px', `${route.label}: invalid and untrusted resize probes do not replace the trusted height`)
  const metaLeadCall = matchingCalls(form.fbqCalls, 'Meta', 'Lead')[0]
  assert(metaLeadCall?.[3]?.eventID === leadEventId, `${route.label}: Meta Lead uses the stable server-issued deduplication ID`)
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

const consentRoute = routes[0]
const consentSearch = `?${new URLSearchParams({
  ...approvedCampaignAttribution,
  utm_content: consentRoute.campaignContent,
  fbclid: 'IwAR_test_click_id'
})}`
for (const consentCase of [
  { label: 'denied consent', analytics: 'denied', advertising: 'denied', signalState: 'withheld_no_consent' },
  { label: 'unavailable consent', analytics: 'unavailable', advertising: 'unavailable', signalState: 'withheld_no_consent' }
]) {
  const form = runFormFlow(consentRoute, consentSearch, consentCase)
  assert(matchingCalls(form.gtagCalls, 'GA4', 'form_start').length === 0, `${consentCase.label}: GA4 form_start is not queued`)
  assert(matchingCalls(form.gtagCalls, 'GA4', 'generate_lead').length === 0, `${consentCase.label}: GA4 lead is not emitted`)
  assert(matchingCalls(form.fbqCalls, 'Meta', 'Lead').length === 0, `${consentCase.label}: Meta Lead is not emitted`)
  const context = form.contextMessages[0]?.message?.context
  assert(context?.utm_source_state === consentCase.signalState, `${consentCase.label}: UTM presence is explicit without its value`)
  assert(context?.fbclid_state === consentCase.signalState, `${consentCase.label}: click-ID presence is explicit without its value`)
  assert(!Object.prototype.hasOwnProperty.call(context || {}, 'utm_source'), `${consentCase.label}: UTM value is withheld`)
  assert(!Object.prototype.hasOwnProperty.call(context || {}, 'fbclid'), `${consentCase.label}: click-ID value is withheld`)
  rows.push({
    case: `Wi-Fi ${consentCase.label}`,
    ga4: 'form_start ×0; generate_lead ×0',
    meta: 'Lead ×0',
    protocol: `Forms operational context ×1; campaign values ${consentCase.signalState}`
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
