// Progressive enhancement: native anchors work without this script.
// Scrolling updates the reading location, never focus or browser history.
(() => {
  document.querySelectorAll('[data-editorial-contents]').forEach((nav) => {
    const article = nav.closest('article');
    const entries = [...nav.querySelectorAll('a[href^="#"]')]
      .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
      .filter(({ target }) => target && article.contains(target));
    if (!entries.length) return;

    const toggle = nav.querySelector('.ed-toc-toggle');
    const currentLabel = nav.querySelector('[data-current-section]');
    const mobile = window.matchMedia('(max-width: 1000px)');
    const close = () => {
      nav.removeAttribute('data-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    };
    if (toggle) {
      nav.setAttribute('data-enhanced', '');
      toggle.hidden = false;
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        nav.toggleAttribute('data-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && mobile.matches && nav.hasAttribute('data-open')) {
          close();
          toggle.focus();
          event.preventDefault();
        }
      });
      nav.addEventListener('click', (event) => {
        const entry = entries.find(({ link }) => link.contains(event.target));
        if (!entry || !mobile.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        close();
        // An explicit selection may move focus; passive scrolling never does.
        if (!entry.target.hasAttribute('tabindex')) entry.target.setAttribute('tabindex', '-1');
        entry.target.focus({ preventScroll: true });
      });
      document.addEventListener('click', (event) => {
        if (!nav.contains(event.target)) close();
      });
      mobile.addEventListener('change', () => {
        const focused = document.activeElement;
        if (!mobile.matches && focused === toggle) (current || entries[0]).link.focus({ preventScroll: true });
        else if (mobile.matches && entries.some(({ link }) => link === focused)) toggle.focus({ preventScroll: true });
        close();
      });
    }

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
      if (currentLabel) currentLabel.textContent = active.link.textContent.trim();
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
