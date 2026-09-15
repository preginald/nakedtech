(() => {
  const library = document.querySelector('[data-guide-library]')
  if (!library) return
  const input = library.querySelector('#guide-query')
  const entries = [...library.querySelectorAll('[data-guide-entry]')]
  const topics = [...library.querySelectorAll('[data-guide-topic]')]
  const normalise = (value) => value.toLowerCase().replace(/[\u2010-\u2015-]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const update = () => {
    const terms = normalise(input.value).trim().split(/\s+/).filter(Boolean)
    let count = 0
    for (const entry of entries) {
      entry.hidden = !terms.every((term) => normalise(entry.dataset.guideTerms).includes(term))
      if (!entry.hidden) count += 1
    }
    for (const topic of topics) topic.hidden = ![...topic.querySelectorAll('[data-guide-entry]')].some((entry) => !entry.hidden)
    library.querySelector('#guide-result-count').textContent = `${count} of ${entries.length} guides${terms.length ? ' match your search' : ' to explore'}.`
    library.querySelector('[data-guide-empty]').hidden = count !== 0
  }
  library.querySelector('[data-guide-filter]').hidden = false
  input.addEventListener('input', update)
  library.querySelector('[data-guide-clear]').addEventListener('click', () => { input.value = ''; update(); input.focus() })
  library.querySelectorAll('nav a[href^="#"]').forEach((link) => link.addEventListener('click', () => { input.value = ''; update() }))
  update()
})()
