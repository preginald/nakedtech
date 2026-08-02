(function() {
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-site-search-trigger]'))
  var dialog = document.querySelector('[data-site-search-dialog]')
  if (!triggers.length || !dialog) return

  var closeButton = dialog.querySelector('[data-site-search-close]')
  var modalForm = dialog.querySelector('[data-site-search-form]')
  var modalContext = createContext(
    dialog.querySelector('[data-site-search-input]'),
    dialog.querySelector('[data-site-search-status]'),
    dialog.querySelector('[data-site-search-results]'),
    'navigation'
  )
  var intentApi = window.nakedTechSearchIntents
  var pagefindPromise = null
  var previousFocus = null
  var dialogAnimation = null
  var isClosing = false
  var reportedEvents = {}

  function createContext(input, status, results, source) {
    return {
      input: input,
      status: status,
      results: results,
      source: source,
      timer: null,
      sequence: 0,
    }
  }

  function setStatus(context, message) {
    context.status.textContent = message
  }

  function clearResults(context) {
    while (context.results.firstChild) context.results.removeChild(context.results.firstChild)
    context.results.hidden = true
  }

  function setResultsBusy(context, busy) {
    if (busy) context.results.setAttribute('aria-busy', 'true')
    else context.results.removeAttribute('aria-busy')
  }

  function syncLauncherQueries() {
    var query = modalContext.input.value.trim()
    document.querySelectorAll('[data-site-search-launcher-value]').forEach(function(value) {
      var placeholder = value.dataset.placeholder || 'Search Naked Tech'
      var trigger = value.closest('[data-site-search-trigger]')
      value.textContent = query || placeholder
      if (!trigger) return
      trigger.classList.toggle('text-muted', !query)
      trigger.classList.toggle('text-ink', Boolean(query))
    })
  }

  function motionAllowed() {
    return typeof dialog.animate === 'function'
      && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum)
  }

  function launcherClip(origin) {
    var dialogRect = dialog.getBoundingClientRect()
    if (!origin || !origin.isConnected || !dialogRect.width || !dialogRect.height) {
      return 'inset(8% 8% 8% 8% round 1rem)'
    }
    var originRect = origin.getBoundingClientRect()
    var width = Math.min(Math.max(originRect.width, 44), dialogRect.width)
    var height = Math.min(Math.max(originRect.height, 44), dialogRect.height)
    var centerX = clamp(
      originRect.left + (originRect.width / 2) - dialogRect.left,
      width / 2,
      dialogRect.width - (width / 2)
    )
    var centerY = clamp(
      originRect.top + (originRect.height / 2) - dialogRect.top,
      height / 2,
      dialogRect.height - (height / 2)
    )
    var top = centerY - (height / 2)
    var right = dialogRect.width - centerX - (width / 2)
    var bottom = dialogRect.height - centerY - (height / 2)
    var left = centerX - (width / 2)
    return 'inset(' + top + 'px ' + right + 'px ' + bottom + 'px ' + left + 'px round 1rem)'
  }

  function stopDialogAnimation() {
    if (!dialogAnimation) return
    dialogAnimation.cancel()
    dialogAnimation = null
  }

  function animateDialogOpen(origin) {
    if (!motionAllowed()) return
    stopDialogAnimation()
    dialogAnimation = dialog.animate([
      {
        clipPath: launcherClip(origin),
        opacity: 0.35,
        transform: 'scale(0.985)'
      },
      {
        clipPath: 'inset(0 0 0 0 round 1.5rem)',
        opacity: 1,
        transform: 'scale(1)'
      }
    ], {
      duration: 260,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    })
    var animation = dialogAnimation
    animation.finished.then(function() {
      if (dialogAnimation !== animation) return
      animation.cancel()
      dialogAnimation = null
    }).catch(function() {})
  }

  function finishDialogClose(animation) {
    if (dialogAnimation === animation) dialogAnimation = null
    if (animation) animation.cancel()
    dialog.classList.remove('site-search-closing')
    if (typeof dialog.close === 'function' && dialog.open) dialog.close()
    else {
      dialog.removeAttribute('open')
      restorePage()
    }
  }

  function animateDialogClose() {
    if (!motionAllowed()) {
      finishDialogClose(null)
      return
    }
    stopDialogAnimation()
    dialog.classList.add('site-search-closing')
    dialogAnimation = dialog.animate([
      {
        clipPath: 'inset(0 0 0 0 round 1.5rem)',
        opacity: 1,
        transform: 'scale(1)'
      },
      {
        clipPath: launcherClip(previousFocus),
        opacity: 0.2,
        transform: 'scale(0.985)'
      }
    ], {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
      fill: 'both'
    })
    var animation = dialogAnimation
    animation.finished.then(function() {
      finishDialogClose(animation)
    }).catch(function() {
      if (dialogAnimation === animation) finishDialogClose(animation)
    })
  }

  function analyticsAllowed() {
    var tracking = window.nakedTechTracking
    return Boolean(
      tracking
      && typeof tracking.getPreferences === 'function'
      && tracking.getPreferences().analytics === true
      && typeof window.gtag === 'function'
    )
  }

  function recordBoundedEvent(eventName, intent, interestType, source) {
    if (!analyticsAllowed() || !intentApi || typeof intentApi.analyticsPayload !== 'function') return
    var key = [eventName, intent.category, interestType || 'none'].join(':')
    if (reportedEvents[key]) return
    reportedEvents[key] = true
    window.gtag('event', eventName, intentApi.analyticsPayload(
      intent,
      source,
      interestType,
      window.location.pathname
    ))
  }

  function recordServiceSelection(intent, source) {
    if (!analyticsAllowed() || !intentApi || typeof intentApi.serviceSelectionPayload !== 'function') return
    var key = ['site_search_service_select', intent.category, intent.actionHref].join(':')
    if (reportedEvents[key]) return
    reportedEvents[key] = true
    window.gtag('event', 'site_search_service_select', intentApi.serviceSelectionPayload(
      intent,
      source,
      window.location.pathname
    ))
  }

  function loadPagefind() {
    if (!pagefindPromise) {
      pagefindPromise = import('/pagefind/pagefind.js').then(function(pagefind) {
        return pagefind.options({
          excerptLength: 24,
          ranking: {
            metaWeights: {
              title: 7,
              service_name: 7,
              search_terms: 5,
              description: 2
            }
          }
        }).then(function() {
          return pagefind.init()
        }).then(function() {
          return pagefind
        })
      })
    }
    return pagefindPromise
  }

  function safeResultUrl(value) {
    try {
      var url = new URL(value, window.location.origin)
      if (url.origin !== window.location.origin) return null
      return url.pathname + url.search + url.hash
    } catch (error) {
      return null
    }
  }

  function resultItem(data, context) {
    var href = safeResultUrl(data.url)
    if (!href) return null

    var item = document.createElement('li')
    var link = document.createElement('a')
    var heading = document.createElement('span')
    var excerpt = document.createElement('span')
    var details = document.createElement('span')
    var kind = data.meta && data.meta.kind
    var price = data.meta && data.meta.price
    var serviceKey = data.meta && data.meta.service_key

    item.className = 'rounded-2xl border border-line bg-canvas transition-colors hover:border-accent'
    link.className = 'block rounded-2xl p-4 sm:p-5'
    link.href = href
    heading.className = 'block text-lg font-bold text-ink'
    heading.textContent = (data.meta && data.meta.title) || 'Naked Tech page'
    excerpt.className = 'mt-2 block text-sm leading-relaxed text-muted'
    excerpt.textContent = data.plain_excerpt || (data.meta && data.meta.description) || 'Open this page for more information.'
    details.className = 'mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-[0.12em] text-accent-ink'
    details.textContent = [kind, price].filter(Boolean).join(' · ')

    link.appendChild(heading)
    link.appendChild(excerpt)
    if (details.textContent) link.appendChild(details)
    if (serviceKey) {
      link.addEventListener('click', function() {
        recordServiceSelection({
          category: serviceKey,
          actionHref: href,
        }, context.source)
      })
    }
    item.appendChild(link)
    return item
  }

  function intentItem(intent, context) {
    var item = document.createElement('li')
    var article = document.createElement('article')
    var eyebrow = document.createElement('p')
    var heading = document.createElement('h3')
    var description = document.createElement('p')
    var footer = document.createElement('p')

    item.className = 'rounded-2xl border-2 border-accent/50 bg-accent/10'
    item.dataset.siteSearchIntentCard = ''
    item.dataset.intentCategory = intent.category
    article.className = 'p-4 sm:p-5'
    eyebrow.className = 'text-xs font-bold uppercase tracking-[0.12em] text-accent-ink'
    eyebrow.textContent = 'A useful next step'
    heading.className = 'mt-2 text-lg font-bold text-ink'
    heading.textContent = intent.title
    description.className = 'mt-2 text-sm leading-relaxed text-muted'
    description.textContent = intent.description
    footer.className = 'mt-4 text-xs font-bold uppercase tracking-[0.12em] text-accent-ink'
    footer.textContent = intent.footer

    article.appendChild(eyebrow)
    article.appendChild(heading)
    article.appendChild(description)
    article.appendChild(footer)

    if (intent.actionType && intent.actionLabel) {
      var action = document.createElement('a')
      action.className = 'mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-inverse px-5 py-2 text-sm font-bold text-inverse-ink transition hover:bg-black'
      action.href = intent.actionHref || '/contact/'
      action.textContent = intent.actionLabel
      action.dataset.siteSearchInterest = intent.actionType
      action.addEventListener('click', function() {
        if (intent.resultState === 'published_service') {
          recordServiceSelection(intent, context.source)
        } else {
          recordBoundedEvent('site_search_interest', intent, intent.actionType, context.source)
        }
      })
      article.appendChild(action)
    }

    item.appendChild(article)
    return item
  }

  function renderIntent(context, intent, sequence) {
    if (sequence !== context.sequence) return
    clearResults(context)
    context.results.appendChild(intentItem(intent, context))
    context.results.hidden = false
    setResultsBusy(context, false)
    setStatus(context, 'Showing guidance for ' + intent.label + '.')
    if (intent.resultState !== 'published_service') {
      recordBoundedEvent('site_search_unmet_demand', intent, null, context.source)
    }
  }

  function intentChoiceItem(context, sequence) {
    if (!intentApi || typeof intentApi.list !== 'function') return null
    var choices = intentApi.list()
    if (!choices.length) return null

    var item = document.createElement('li')
    var heading = document.createElement('h3')
    var description = document.createElement('p')
    var buttons = document.createElement('div')

    item.className = 'rounded-2xl border border-line bg-canvas p-4 sm:p-5'
    item.dataset.siteSearchIntentChoices = ''
    heading.className = 'text-lg font-bold text-ink'
    heading.textContent = 'Still not seeing the right topic?'
    description.className = 'mt-2 text-sm leading-relaxed text-muted'
    description.textContent = 'Choose the closest area. If Analytics is enabled, only this category can be counted—not the words you typed.'
    buttons.className = 'mt-4 flex flex-wrap gap-2'

    choices.forEach(function(intent) {
      var button = document.createElement('button')
      button.type = 'button'
      button.className = 'min-h-11 rounded-full border border-line bg-surface px-4 py-2 text-left text-sm font-bold text-ink transition hover:border-accent hover:text-accent-ink'
      button.textContent = intent.label
      button.dataset.intentCategory = intent.category
      button.addEventListener('click', function() {
        renderIntent(context, intent, sequence)
      })
      buttons.appendChild(button)
    })

    item.appendChild(heading)
    item.appendChild(description)
    item.appendChild(buttons)
    return item
  }

  function renderNoMatch(context, sequence) {
    if (sequence !== context.sequence) return
    clearResults(context)
    var choices = intentChoiceItem(context, sequence)
    if (choices) {
      context.results.appendChild(choices)
      context.results.hidden = false
    }
    setResultsBusy(context, false)
    setStatus(context, 'No close matching service or guide was found. Try different words or choose a topic below.')
  }

  function renderResults(context, search, sequence) {
    var total = search.results.length
    var selected = search.results.slice(0, 5)
    return Promise.all(selected.map(function(result) {
      return result.data().catch(function() {
        return null
      })
    })).then(function(items) {
      if (sequence !== context.sequence) return
      clearResults(context)
      items.forEach(function(data) {
        if (!data) return
        var item = resultItem(data, context)
        if (item) context.results.appendChild(item)
      })

      var shown = context.results.children.length
      if (!shown) {
        renderNoMatch(context, sequence)
        return
      }

      context.results.hidden = false
      setResultsBusy(context, false)
      setStatus(context, total > shown
        ? 'Showing the first ' + shown + ' of ' + total + ' results.'
        : shown + (shown === 1 ? ' result found.' : ' results found.'))
    })
  }

  function runSearch(context, query, sequence) {
    loadPagefind().then(function(pagefind) {
      return pagefind.search(query)
    }).then(function(search) {
      if (sequence !== context.sequence) return
      if (!search.results.length) {
        renderNoMatch(context, sequence)
        return
      }
      return renderResults(context, search, sequence)
    }).catch(function() {
      if (sequence !== context.sequence) return
      clearResults(context)
      setResultsBusy(context, false)
      setStatus(context, 'Search is unavailable right now. You can still use the navigation or contact Naked Tech.')
    })
  }

  function scheduleSearch(context, immediate) {
    var query = context.input.value.trim()
    context.sequence += 1
    var sequence = context.sequence
    window.clearTimeout(context.timer)

    if (query.length < 2) {
      clearResults(context)
      setResultsBusy(context, false)
      setStatus(context, 'Type at least two characters to search services and guides.')
      return
    }

    var hasVisibleResults = !context.results.hidden && context.results.children.length > 0
    setResultsBusy(context, true)
    if (!hasVisibleResults) setStatus(context, 'Searching…')
    context.timer = window.setTimeout(function() {
      var intent = intentApi && typeof intentApi.classify === 'function'
        ? intentApi.classify(query)
        : null
      if (intent) {
        renderIntent(context, intent, sequence)
        return
      }
      runSearch(context, query, sequence)
    }, immediate ? 0 : 180)
  }

  function showSearch(origin) {
    if (dialog.open || isClosing) return
    previousFocus = origin
    var source = origin.dataset.siteSearchSource
    modalContext.source = source === 'homepage' || source === 'services' ? source : 'navigation'
    document.querySelectorAll('[data-nav-disclosure][open]').forEach(function(disclosure) {
      disclosure.removeAttribute('open')
    })
    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    document.body.classList.add('site-search-open')
    animateDialogOpen(origin)
    window.requestAnimationFrame(function() {
      modalContext.input.focus()
    })

    if (modalContext.input.value.trim().length >= 2) {
      scheduleSearch(modalContext, false)
      return
    }

    if (!pagefindPromise) setStatus(modalContext, 'Loading search…')
    loadPagefind().then(function() {
      setStatus(modalContext, 'Type at least two characters to search services and guides.')
    }).catch(function() {
      setStatus(modalContext, 'Search is unavailable right now. You can still use the navigation or contact Naked Tech.')
    })
  }

  function closeSearch() {
    if (isClosing) return
    window.clearTimeout(modalContext.timer)
    modalContext.sequence += 1
    setResultsBusy(modalContext, false)
    syncLauncherQueries()
    if (typeof dialog.close === 'function' && dialog.open) {
      isClosing = true
      animateDialogClose()
    } else {
      dialog.removeAttribute('open')
      restorePage()
    }
  }

  function restorePage() {
    isClosing = false
    dialog.classList.remove('site-search-closing')
    document.body.classList.remove('site-search-open')
    syncLauncherQueries()
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus()
    previousFocus = null
  }

  triggers.forEach(function(trigger) {
    trigger.hidden = false
    trigger.addEventListener('click', function() {
      showSearch(trigger)
    })
  })
  closeButton.addEventListener('click', closeSearch)
  modalForm.addEventListener('submit', function(event) {
    event.preventDefault()
    scheduleSearch(modalContext, true)
  })
  modalContext.input.addEventListener('input', function() {
    syncLauncherQueries()
    scheduleSearch(modalContext, false)
  })
  dialog.addEventListener('close', restorePage)
  dialog.addEventListener('cancel', function(event) {
    event.preventDefault()
    closeSearch()
  })
  dialog.addEventListener('click', function(event) {
    if (event.target === dialog) closeSearch()
  })
  dialog.addEventListener('keydown', function(event) {
    if (event.key !== 'Tab') return
    var focusable = Array.prototype.slice.call(dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]'))
    if (!focusable.length) return
    var first = focusable[0]
    var last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  })
})()
