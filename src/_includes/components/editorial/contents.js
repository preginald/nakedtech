// Progressive enhancement: native anchors work without this script.
// Scrolling updates the reading location, never focus or browser history.
(() => {
  document.querySelectorAll('[data-editorial-contents]').forEach((nav) => {
    const article = nav.closest('article');
    const entries = [...nav.querySelectorAll('a[href^="#"]')]
      .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
      .filter(({ target }) => target && article.contains(target));
    if (!entries.length) return;

    let scheduled = false;
    let current = null;
    const update = () => {
      scheduled = false;
      // Use the same offset as native anchor navigation beneath the fixed header.
      const readingLine = (parseFloat(getComputedStyle(entries[0].target).scrollMarginTop) || 0) + 2;
      let active = entries[0];
      for (const entry of entries) {
        if (entry.target.getBoundingClientRect().top <= readingLine) active = entry;
      }
      if (active === current) return;
      entries.forEach(({ link }) => link.removeAttribute('aria-current'));
      active.link.setAttribute('aria-current', 'location');
      current = active;
    };
    const schedule = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
    if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(article);
    update();
  });
})();
