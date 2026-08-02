# Naked Tech Site Search Implementation Brief

**Status:** Implemented and approved for release
**Prepared:** 2 August 2026
**Repository:** `/home/preginald/Dev/nakedtech`

## Handoff instruction

Use this document as the source of intent for a fresh Codex session. Re-read
`AGENTS.md`, inspect the current repository and working tree, and verify all
assumptions before editing. Preserve unrelated changes. Implement only after
the user approves implementation, and ask separately before committing,
pushing or deploying.

## Recommendation

Add a small, accessible site-search feature using Pagefind. Treat it primarily
as a visitor-navigation improvement. Do not describe it as an SEO ranking
feature or an agent API.

The expected effort is one to two engineering days, including styling,
accessibility and automated tests. There should be no recurring search-service
charge: Pagefind generates static search assets after the Eleventy build and
runs in the visitor's browser.

This work should follow any active production-verification or Digital Sanctum
remediation work rather than interrupt it.

## Approved follow-up — homepage entry and demand signals

The owner approved a prominent homepage search entry and privacy-safe discovery
of unmet service demand on 2 August 2026. The implementation must preserve the
original privacy boundary:

- typed search text stays in the browser and is passed only to the local
  Pagefind runtime or local bounded-intent classifier;
- unsupported, referral and published-service topics use a reviewed allowlist
  rather than arbitrary analytics labels;
- only an intent category, result state, search entry point, current pathname
  and optional referral/service-interest type may be reported;
- events fire only when Analytics is already enabled and are not queued for
  later consent; and
- no referral or customer details are passed to another provider without a
  separate, explicit customer action.

The reviewed initial categories are data recovery, backup setup, hardware
repair, phone/tablet setup, provider-controlled account recovery, myGov or
online-banking help, security cameras, and virus/malware help. Backup setup,
phone/tablet migration and virus/malware remediation were promoted to
`published_service` destinations on 2 August 2026 after their fixed offers and
routes were approved. The other five categories retain their referral or
official-channel guidance.

The homepage entry is a progressively enhanced modal launcher styled as a
search field. Activating it by pointer or keyboard opens the same search dialog
used by the navigation and moves focus directly to the modal input. This avoids
layout movement, flashing inline states and a competing second results layer.
Without JavaScript, the launcher is replaced by a services-and-pricing link.
The dialog uses a stable responsive height, retains the previous result cards
while a debounced query update is pending, and progressively morphs from and
back toward its launcher unless reduced motion is requested. Modal query text
is mirrored through `textContent` into the homepage launcher so closing and
reopening always presents consistent local state.

## Why it is worthwhile

Naked Tech publishes 11 active service offers plus service guidance, toolkit
content and legal information. Visitors will not always know the service names.
They may search using problem language such as:

- `internet keeps dropping`
- `hacked` or `scammed`
- `new laptop`
- `forgotten passwords`
- `printer will not connect`

Search therefore has useful human-navigation value, particularly on mobile and
for visitors arriving on a page that does not directly match their problem.

The value differs by audience:

- **Visitors:** Good. It provides a quick route from ordinary problem language
  to the most relevant service or guide.
- **Search engines:** Modest and indirect. Search may improve navigation and
  engagement, but it does not create new indexable information or guarantee a
  ranking benefit. Existing pages, internal links, sitemap, metadata and
  structured data remain more important.
- **Agents:** Minimal. Pagefind's browser index is not a stable public contract.
  Agents should continue to use `/services.json`, JSON-LD, semantic HTML and
  `sitemap.xml`. Do not expose Pagefind as an agent operation or claim it
  provides agent discovery.

## Reference implementation

Digital Sanctum and Tania Ruddick Therapies currently use the same broad
pattern: a search modal backed by a lazily loaded Pagefind index.

- Digital Sanctum search script:
  <https://digitalsanctum.com.au/assets/js/global-search.js>
- Tania Ruddick Therapies search script:
  <https://www.taniaruddicktherapies.com.au/assets/js/global-search.js>
- Pagefind documentation: <https://pagefind.app/docs/>

These are references, not code to copy unchanged. The Naked Tech implementation
must match this repository's design, accessibility requirements, analytics
contract and testing conventions.

## Proposed scope

### Build and dependencies

- Add Pagefind as a pinned development dependency in `package.json` and
  `package-lock.json`.
- Generate the Pagefind index only after the complete Eleventy site exists in
  `_site/`.
- Avoid introducing a race into the current parallel `build:*` scripts. A
  `postbuild` step such as `pagefind --site _site` is a likely implementation,
  but confirm it against the current scripts before changing them.
- Ensure `npm test` generates and validates the same search assets that will be
  deployed.
- Do not add a hosted search provider, server-side search endpoint, database or
  recurring service dependency.

### Search interface

- Add a search trigger to the shared base layout on desktop and mobile.
- Fit it into the existing navigation without weakening the primary contact or
  booking action.
- Present results in a Naked Tech-styled modal or dialog.
- Initially return no more than five high-quality results.
- Each result should include a clear title, a short contextual excerpt and a
  direct link. Show catalogue pricing only if it can be sourced from canonical
  catalogue facts without duplicating data.
- Provide useful empty, loading, unavailable and no-results states.
- Search should continue to fail safely if JavaScript or the Pagefind index is
  unavailable; ordinary navigation must remain usable.

### Indexed content

Index:

- the 11 active service pages;
- the services and pricing overview;
- user-facing symptoms, inclusions, exclusions and process explanations;
- the technology toolkit and other substantive public guidance;
- relevant contact and service-area information.

Exclude or strongly de-prioritise:

- the retired Bodyguard service;
- redirect and confirmation pages;
- invoice templates;
- `/services.json` and `/version.json`;
- sitemap, robots and generated search assets;
- navigation, footer and repeated boilerplate that would pollute excerpts;
- pages marked `noindex` or otherwise not intended for public discovery.

Use Pagefind's indexing, metadata and weighting controls rather than inserting
hidden keyword stuffing. Service titles, canonical service names and visible
problem/symptom language should carry greater relevance than repeated layout
text. Because Pagefind is lexical rather than a semantic agent, important
synonyms should appear naturally in visible page content or explicit Pagefind
metadata.

### Accessibility and interaction

The finished search must support:

- a real button with an accessible name;
- an appropriately labelled dialog;
- focus moving into search when opened;
- Escape to close;
- focus returning to the trigger after close;
- sensible Tab and Shift+Tab behaviour;
- keyboard activation of results;
- visible focus styles;
- screen-reader announcements or understandable status text for result counts,
  no-results and failure states;
- touch targets and a usable modal at narrow mobile widths;
- reduced-motion preferences where animation is used.

A `Ctrl+K` or `Command+K` shortcut is optional. It must not interfere with text
entry, browser behaviour or assistive technology.

### Security and privacy

- Keep search execution and query text in the browser.
- Do not send raw search terms to Naked Tech, analytics providers or another
  search service. Visitors may type personal information, account concerns or
  details of a scam into the search box.
- Analytics may record only the bounded `site_search_unmet_demand`,
  `site_search_interest` and `site_search_service_select` events approved
  above, and only after the existing analytics-consent mechanism reports an
  active Analytics opt-in. Published-service selection may include only its
  allowlisted intent/service key and internal destination path.
- Do not attach the raw query to the event.
- Do not interpolate user input directly into `innerHTML`.
- Prefer DOM APIs and `textContent` for user-controlled values. Any Pagefind
  excerpt markup must be handled through a narrowly defined and reviewed path.
- Keep the index free of private, operational, draft and generated content.

## Non-goals

This work does not include:

- semantic or AI-powered search;
- a hosted search account;
- an API search operation;
- MCP, UCP or A2A support;
- customer-data collection;
- search-result pages intended for search-engine indexing;
- a claim that search improves rankings or guarantees agent ingestion;
- replacing `/services.json`, JSON-LD or the sitemap as machine contracts;
- publishing new service or editorial content solely to make the search feature
  appear larger.

## Testing and acceptance criteria

### Build and structural checks

- `npm ci` succeeds from the lockfile.
- `npm run build` produces the Pagefind runtime and index under `_site/`.
- The build order is deterministic and Pagefind never starts before Eleventy has
  finished writing the site.
- `npm test` passes all existing site and analytics assertions.
- `npm audit` is reviewed and introduces no unresolved relevant vulnerability.
- `git diff --check` passes.

### Index quality

- Exactly the 11 active services are discoverable by canonical service name.
- Representative natural-language queries find the intended service, including
  Wi-Fi dropouts, scam/account security, slow computer, email, printer and new
  computer setup cases.
- Bodyguard is absent.
- Redirects, thank-you pages, invoices, JSON endpoints and repeated navigation
  text do not appear as results.
- Result titles and URLs use canonical page metadata.
- The built index contains no personal information, internal filesystem paths,
  secrets or draft operational material.

### Interface behaviour

- Search opens and closes by mouse, touch and keyboard.
- Focus placement and restoration work correctly.
- Escape closes the interface.
- Empty, loading, results, no-results and unavailable states are understandable.
- Result links work with ordinary navigation and keyboard activation.
- The interface remains usable at common mobile, tablet and desktop widths.
- Light, dark and system themes remain legible.
- The site remains navigable with JavaScript disabled.

### Analytics and privacy

- No query text leaves the browser.
- No search analytics event fires before analytics consent.
- `site_search_unmet_demand`, `site_search_interest` and
  `site_search_service_select` contain no raw query or customer-entered content.
- Existing landing-page, form and consent analytics contracts remain unchanged.

### Manual verification

- Inspect the modal and representative results using `npm start` or an
  equivalent local preview.
- Check mobile navigation crowding and ensure search does not displace the main
  service/contact journey.
- Test with keyboard-only navigation and at least one screen-reader workflow.
- After any approved deployment, verify the Pagefind assets return `200`, search
  works on the apex HTTPS site, and HTTP/`www` redirect behaviour is unchanged.

## Suggested implementation sequence

1. Recheck `git status`, current branch, current build scripts, base layout,
   content collections and site-audit expectations.
2. Record the exact proposed diff scope and confirm no unrelated files will be
   touched.
3. Add the pinned Pagefind dependency and deterministic post-build indexing.
4. Mark the intended searchable content and exclusions.
5. Add the shared accessible search trigger, dialog and safe rendering logic.
6. Add structural, index-quality, privacy and analytics regression checks.
7. Run the full build, tests, audit and responsive/manual inspection.
8. Present the complete diff and evidence before requesting commit approval.
9. Request push/deployment approval separately after any approved commit.

## Expected file scope

Confirm this against the current checkout before implementation. The likely
scope is:

- `package.json`
- `package-lock.json`
- `.eleventy.js` or Pagefind configuration, only if indexing controls require it
- `src/_includes/layouts/base.njk`
- one reusable search component under `src/_includes/components/`
- one search script under `src/assets/`
- `src/css/styles.css` only where existing Tailwind utilities are insufficient
- `scripts/site-audit.mjs`
- focused documentation or analytics expectations if the bounded event is added

Avoid modifying service catalogue facts or the existing form integration unless
a concrete, tested search requirement makes that unavoidable.

## Decision gates

- **Gate 1:** Approve implementation after baseline and exact diff scope are
  presented.
- **Gate 2:** Review the complete diff, search-quality evidence, accessibility
  checks and full test results; ask whether to commit.
- **Gate 3:** After commit approval, ask separately whether to push and deploy.
