(function(root, factory) {
  var api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  if (root) root.nakedTechSearchIntents = api
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict'

  var definitions = [
    {
      category: 'digital_services_help',
      label: 'myGov or online banking',
      resultState: 'official_channel',
      footer: 'Use official support',
      title: 'Use the official service channel',
      description: 'For myGov or online-banking access, use the provider’s official support and keep passwords, PINs and verification codes private.',
      patterns: [
        /\bmygov\b/,
        /\b(?:online|internet) banking\b/,
        /\bbank(?:ing)? (?:login|log in|account|app|website)\b/,
      ],
    },
    {
      category: 'account_recovery',
      label: 'Locked account or provider recovery',
      resultState: 'official_channel',
      footer: 'Use official recovery',
      title: 'Account recovery stays with the provider',
      description: 'Naked Tech cannot override an account provider’s identity or recovery process. Use the provider’s official recovery route and never give anyone your password or verification code.',
      patterns: [
        /\blocked out\b/,
        /\baccount (?:is )?locked\b/,
        /\blocked (?:out of )?(?:my )?(?:google|apple|microsoft|facebook|instagram|email|icloud|outlook|gmail)? ?account(?: recovery)?\b/,
        /\b(?:recover|recovery of|regain access to) (?:my )?(?:google|apple|microsoft|facebook|instagram|email|icloud|outlook|gmail) account\b/,
        /\b(?:lost|no access to) (?:my )?(?:two factor|2fa|verification|authenticator)\b/,
        /\bprovider(?: controlled)? (?:account )?recovery\b/,
      ],
    },
    {
      category: 'data_recovery',
      label: 'Lost files or data recovery',
      resultState: 'referral',
      footer: 'Referral opportunity',
      title: 'Lost files or specialist data recovery',
      description: 'Naked Tech does not currently provide deleted-file or failed-drive recovery. A vetted data-recovery specialist may be the safer next step.',
      actionType: 'referral_request',
      actionLabel: 'Ask about a trusted referral',
      patterns: [
        /\bdata recovery\b/,
        /\b(?:recover|restore) (?:my )?(?:deleted|lost|missing) (?:data|files|photos|documents)\b/,
        /\b(?:deleted|lost|missing) (?:data|files|photos|documents)\b/,
        /\b(?:hard )?drive (?:failed|failure|recovery)\b/,
        /\bfiles (?:have )?disappeared\b/,
        /\bformatted (?:drive|disk|card)\b/,
      ],
    },
    {
      category: 'hardware_repair',
      label: 'No power, broken screen or hardware repair',
      resultState: 'referral',
      footer: 'Referral opportunity',
      title: 'Power faults and physical repairs',
      description: 'Naked Tech does not currently provide component-level repairs, screen replacement, battery replacement or charging-port repair. A vetted repair specialist may be more suitable.',
      actionType: 'referral_request',
      actionLabel: 'Ask about a trusted referral',
      patterns: [
        /\b(?:computer|pc|laptop|mac|macbook|phone|tablet|ipad|iphone) (?:will not|wont|does not|doesnt) (?:start|boot|turn on|power on|charge)\b/,
        /\b(?:computer|pc|laptop|mac|macbook|phone|tablet|ipad|iphone) (?:is )?not (?:starting|booting|turning on|powering on|charging)\b/,
        /\b(?:no power|black screens?|broken screens?|cracked screens?)\b/,
        /\b(?:replace|replacement|swollen|dead) battery\b/,
        /\bbattery (?:replace|replacement|swollen|dead|not charging)\b/,
        /\bcharging (?:fault|port|socket|problem|repair)\b/,
        /\b(?:hardware|screen|component) repair\b/,
        /\bliquid damage\b/,
      ],
    },
    {
      category: 'security_camera',
      label: 'Security cameras or video doorbells',
      resultState: 'referral',
      footer: 'Licensed referral required',
      title: 'Security-camera installation is retired',
      description: 'Naked Tech no longer installs security cameras. In Victoria, installation help should be provided by an appropriately licensed security professional.',
      actionType: 'referral_request',
      actionLabel: 'Ask about a licensed referral',
      patterns: [
        /\bsecurity camera(?:s)?\b/,
        /\bcctv\b/,
        /\b(?:camera|surveillance) installation\b/,
        /\bhome surveillance\b/,
        /\b(?:video|smart) doorbell\b/,
      ],
    },
    {
      category: 'virus_malware',
      label: 'Virus or malware help',
      resultState: 'published_service',
      footer: '$250 fixed incl. GST',
      title: 'Virus and malware diagnosis and removal',
      description: 'One working Windows or Mac computer, up to 90 minutes onsite, safe user-level removal where practical and clear written next steps.',
      actionType: 'service_page',
      actionLabel: 'See the diagnosis visit',
      actionHref: '/services/virus-malware-help-ivanhoe/',
      patterns: [
        /\bvirus(?:es)?\b/,
        /\bmalware\b/,
        /\bransomware\b/,
        /\bspyware\b/,
        /\btrojan\b/,
        /\badware\b/,
        /\binfected (?:computer|pc|laptop|mac|phone|device)\b/,
      ],
    },
    {
      category: 'backup_setup',
      label: 'Backup setup',
      resultState: 'published_service',
      footer: '$250 fixed incl. GST',
      title: 'Computer backup setup and restore readiness',
      description: 'Configure one supported automatic local or cloud backup for one working Windows or Mac computer and test a sample restore.',
      actionType: 'service_page',
      actionLabel: 'See the backup visit',
      actionHref: '/services/backup-setup-ivanhoe/',
      patterns: [
        /\bbackup setup\b/,
        /^backups?$/,
        /\bset up (?:a |my |our )?backup\b/,
        /\bautomatic backup\b/,
        /\bcloud backup\b/,
        /\btime machine (?:setup|backup|help|not working)\b/,
        /\bbackup (?:my|our) (?:computer|pc|laptop|mac|files|photos|phone|tablet)\b/,
        /\bexternal (?:drive|disk) backup\b/,
      ],
    },
    {
      category: 'mobile_setup',
      label: 'Phone or tablet setup and migration',
      resultState: 'published_service',
      footer: '$390 fixed incl. GST',
      title: 'Phone and tablet setup or migration',
      description: 'Set up one customer-supplied new device and complete a supported same-ecosystem move from one working unlocked source.',
      actionType: 'service_page',
      actionLabel: 'See the setup visit',
      actionHref: '/services/phone-tablet-setup-migration-ivanhoe/',
      patterns: [
        /\b(?:new )?(?:phone|tablet|iphone|ipad|android) setup\b/,
        /\bset up (?:my |a |new )?(?:phone|tablet|iphone|ipad|android)\b/,
        /\b(?:phone|tablet|iphone|ipad|android) (?:migration|transfer|move)\b/,
        /\btransfer (?:my )?(?:phone|tablet|iphone|ipad|android)\b/,
        /\bmove (?:my )?(?:data|photos|messages|apps) (?:from|to) (?:a |my )?(?:new |old )?(?:phone|tablet|iphone|ipad|android)\b/,
        /\b(?:android to iphone|iphone to android)\b/,
      ],
    },
  ]

  function normalise(value) {
    return String(value || '')
      .normalize('NFKD')
      .replace(/[’']/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  }

  function publicIntent(definition) {
    if (!definition) return null
    return {
      category: definition.category,
      label: definition.label,
      resultState: definition.resultState,
      footer: definition.footer,
      title: definition.title,
      description: definition.description,
      actionType: definition.actionType || null,
      actionLabel: definition.actionLabel || null,
      actionHref: definition.actionHref || null,
    }
  }

  function classify(value) {
    var query = normalise(value)
    if (!query) return null
    for (var index = 0; index < definitions.length; index += 1) {
      if (definitions[index].patterns.some(function(pattern) { return pattern.test(query) })) {
        return publicIntent(definitions[index])
      }
    }
    return null
  }

  function list() {
    return definitions.map(publicIntent)
  }

  function normaliseSource(source) {
    if (source === 'homepage' || source === 'services') return source
    return 'navigation'
  }

  function analyticsPayload(intent, source, interestType, pagePath) {
    var payload = {
      intent_category: intent.category,
      result_state: intent.resultState,
      search_source: normaliseSource(source),
      page_path: pagePath || '/',
    }
    if (interestType === 'referral_request' || interestType === 'service_enquiry') {
      payload.interest_type = interestType
    }
    return payload
  }

  function serviceSelectionPayload(intent, source, pagePath) {
    return {
      intent_category: intent.category,
      result_state: 'published_service',
      search_source: normaliseSource(source),
      page_path: pagePath || '/',
      destination_path: intent.actionHref,
    }
  }

  return {
    classify: classify,
    list: list,
    analyticsPayload: analyticsPayload,
    serviceSelectionPayload: serviceSelectionPayload,
  }
})
