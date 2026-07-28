# Naked Tech Pain-Point Landing Pages and Paid Campaign Implementation Plan

> **For Hermes:** Execute this plan one phase at a time. Load `web-frontend-development`, `facebook-ads`, and `social-media-ad-readiness-audit` before implementation. Use `parallel-plan-execution` only for genuinely independent tasks. Do not re-run the historical research or reload old sessions unless the canonical report identifies a missing fact.

**Goal:** Build a reusable Nunjucks sales-landing-page system, launch the first two problem-specific pages, instrument the complete conversion funnel, and run a controlled low-budget Meta experiment without fragmenting spend or session context.

**Architecture:** Individual problem pages will be thin Nunjucks files under `src/landing-pages/` that supply structured page data to one shared nested layout at `src/_includes/layouts/sales-landing-page.njk`. The shared layout will own conversion structure, accessibility, trust, CTA placement and analytics conventions; each page will own only problem-specific copy, offer, FAQs, SEO metadata and campaign identifiers. Existing Eleventy, Tailwind, Sanctum Forms, Meta Pixel and GA4 infrastructure will be extended rather than replaced.

**Tech Stack:** Eleventy 3.1, Nunjucks 3.2, Tailwind CSS 3.4, Node site audit, Sanctum Forms iframe/postMessage integration, Meta Pixel, GA4.

**Canonical strategy:** `docs/marketing/2026-07-28-facebook-campaign-and-landing-page-strategy.md`<br>
**Obsidian copy:** `Sanctum Digital/Projects/Naked Tech/Naked Tech - Facebook Campaign and Landing Page Strategy - 2026-07-28.md`<br>
**Created:** 28 July 2026 12:33 AEST<br>
**Status:** Phase 1 in progress<br>
**Current phase:** Phase 1<br>
**Next task:** P1-T4 — create the shared sales landing-page layout

---

## How subsequent AI sessions must use this plan

This section is the continuity mechanism. Follow it instead of importing the full originating conversation.

1. Read only:
   - this plan;
   - the canonical strategy report;
   - files named in the current task.
2. Run `git status --short --branch` before relying on prior state.
3. Work on one phase at a time and keep only one task `in_progress`.
4. Do not repeat the Wayback crawl or market research unless a recorded open question requires new evidence.
5. Mark task checkboxes and update the Phase Control Table immediately after verification.
6. Add no more than eight lines to the Progress Log at the end of a session.
7. Record evidence as commands, route names or file paths—not narrative transcripts.
8. If a task is blocked, write the blocker under that task and stop; do not improvise unsupported pricing, testimonials, guarantees or service scope.
9. Do not commit, push or deploy unless the user explicitly asks in that session.
10. At a visual checkpoint, stop after the named page is working and request review before cloning the pattern.

### Phase Control Table

| Phase | Status | Exit evidence | Next action |
|---|---|---|---|
| 0. Conversion integrity baseline | Complete | Campaign baseline preserved; charset/browser audits pass; analytics contract recorded | Phase 1 |
| 1. Reusable Nunjucks landing-page system | In progress | P1-T1 contract, P1-T2 metadata overrides and P1-T3 secure shared form verified; shared sales layout pending | P1-T4 |
| 2. Wi-Fi pilot landing page | Not started | User-approved responsive page | Start after Phase 1 |
| 3. Slow computer / Windows landing page | Not started | Page verified using unchanged template contract | Start after Phase 2 approval |
| 4. Funnel attribution and form context | Not started | View, phone, form-start and Lead evidence captured | Can overlap final Phase 3 verification |
| 5. Meta two-concept experiment | Not started | Both ads approved, tracking verified, campaign live | Start only after Phases 2–4 |
| 6. Measurement and decision | Not started | Ad-level funnel report and explicit decision | Begin after spend/sample gate |
| 7. Organic/search expansion | Not started | Prioritised pages shipped from measured demand | Begin after Phase 6 |

**Allowed statuses:** `Not started`, `In progress`, `Blocked`, `Awaiting user review`, `Complete`.

---

## Scope and guardrails

### In scope

- Fix the live UTF-8/mojibake defect.
- Establish a reusable modern sales-landing-page Nunjucks template.
- Build Wi-Fi dropouts and slow-computer/Windows pages.
- Reuse the existing brand and design tokens.
- Add page-level SEO, structured data and campaign attribution.
- Reuse or safely extract the existing Sanctum Forms integration.
- Run one local ad set with at most two paid concepts.
- Establish a repeatable page and campaign measurement workflow.

### Out of scope until separately approved

- Rebuilding the whole website.
- Reintroducing a national pickup/workshop model.
- Publishing laptop component/screen pages without an approved service model.
- Claiming fund recovery for scam victims.
- Reusing 2014 testimonials without confirming permission and accuracy.
- Creating near-duplicate suburb doorway pages.
- Launching more than two paid pain-point concepts simultaneously.
- Changing the four existing service pages unless a phase explicitly names the change.

### Commercial decisions that must not be invented

- Whether the diagnostic-first offer is exactly `$190 including the first hour`.
- Whether wording such as “Peter has supported home computer users since 2004” is approved.
- Whether Eaglemont shares the no-call-out policy currently stated for Ivanhoe 3079.
- Whether scam/security assistance includes remote support, in-home support, or both.
- Whether new pages should cover service areas beyond Ivanhoe and Eaglemont.

---

# Phase 0 — Conversion integrity baseline

**Objective:** Remove technical trust defects and preserve a measurable pre-change baseline before landing-page development.

## P0-T1 — Preserve campaign and repository baseline

**Files:**
- Existing evidence: `/home/preginald/Downloads/Naked-Tech-Ads-Campaigns-28-Jun-2026-27-Jul-2026.csv`
- Reference: `docs/marketing/2026-07-28-facebook-campaign-and-landing-page-strategy.md`

**Subtasks:**

- [x] Run `git status --short --branch` and record only whether the tree is clean and the active branch.
- [x] Confirm the current Meta campaign remains inactive; do not reactivate it.
- [x] Preserve the original CSV outside generated build directories.
- [x] Record the baseline figures in the Progress Log: spend $18.84, impressions 2,163, reach 592, frequency 3.65, CPM $8.71, no reported result.
- [x] Confirm no click/LPV columns exist; do not infer missing values.

**Exit criterion:** Baseline values and repository state are recorded without changing campaign delivery.

## P0-T2 — Fix encoding declaration order

**Files:**
- Modify: `src/_includes/layouts/base.njk:3-33`
- Modify tests: `scripts/site-audit.mjs`

**Subtasks:**

- [x] Add an audit that reads generated HTML as bytes/text and asserts `<meta charset="UTF-8">` begins within the first 1,024 bytes.
- [x] Add an audit that fails on common mojibake markers in generated pages: `â`, `Â`, and `�`.
- [x] Run `npm run test` and verify the new charset-position assertion fails against the current source.
- [x] Move `<meta charset="UTF-8">` to the first line after `<head>` in `base.njk`.
- [x] Re-run `npm run test`; expect all checks to pass.
- [x] Build and inspect `/contact/` and `/services/full-strip/` in a real browser.
- [x] Confirm en dash, em dash, middle dot and `$900–$1,800` render correctly.
- [ ] After deployment is separately approved, inspect the HTTP `Content-Type`; record whether server-level `charset=utf-8` is also present.

**Deferred deployment check:** No deployment was approved in this session. The local Eleventy server returns `Content-Type: text/html; charset=utf-8`; production must be rechecked after an approved deployment.

**Exit criterion:** Automated tests enforce encoding placement and a browser shows no mojibake on representative pages.

## P0-T3 — Define the analytics event contract

**Files:**
- Create during implementation: `docs/marketing/landing-page-analytics-contract.md`
- Likely modify later: `src/_includes/layouts/base.njk`
- Likely modify later: `src/contact.njk:73-95`

**Required event vocabulary:**

| User action | GA4 event | Meta event | Required parameters |
|---|---|---|---|
| Pain page viewed | `view_service` | `ViewContent` | `pain_point`, `page_path`, `campaign_content` |
| Phone link clicked | `phone_click` | `Contact` | `pain_point`, `page_path` |
| Enquiry form engaged | `form_start` | Custom or none | `pain_point`, `page_path` |
| Form successfully submitted | `generate_lead` | `Lead` | `pain_point`, `page_path` |

**Subtasks:**

- [x] Document which events are macro-conversions versus micro-conversions.
- [x] Specify that phone click does not equal a completed call.
- [x] Specify UTM keys: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
- [x] Define page-level `pain_point` identifiers: `wifi_dropouts`, `slow_computer`, later `scam_security`.
- [x] Require validation of `message` event origin before accepting Sanctum Forms resize/submission messages.
- [x] Confirm the existing contact script does not remain active alongside a new duplicate handler.

**Exit criterion:** A concise analytics contract exists before event code is moved or duplicated.

---

# Phase 1 — Reusable Nunjucks sales-landing-page system

**Objective:** Create one stable conversion template and prove it using a fixture before writing campaign content.

## Architecture decision

Use individual thin page files rather than one ever-growing global JSON array. This keeps future sessions focused on only the template and the page being edited.

**Planned structure:**

```text
src/
├── _includes/
│   ├── layouts/
│   │   ├── base.njk
│   │   └── sales-landing-page.njk       # shared conversion layout
│   └── components/
│       └── contact-form.njk              # shared embed + trusted postMessage integration
├── landing-pages/
│   ├── wifi-dropouts.njk                 # page-specific front matter/data
│   └── slow-computer-help.njk            # page-specific front matter/data
└── sitemap.njk
```

Each page declares an explicit permalink, such as `/wifi-dropouts-ivanhoe/index.html`, and sets `layout: layouts/sales-landing-page.njk`.

## P1-T1 — Define the page data contract

**Create:** `docs/marketing/landing-page-content-schema.md`

**Required top-level fields:**

```yaml
title: SEO title without the site-name suffix
description: Unique 50+ character meta description
permalink: /problem-route/index.html
ogImage: /img/problem-specific-image.webp
landing:
  id: wifi_dropouts
  eyebrow: Wi-Fi help in Ivanhoe & Eaglemont
  headline: Exact customer pain and desired outcome
  promise: One plain-English paragraph
  offer:
    label: Starting offer label
    price: Approved price text
    note: Scope/exclusion text
  cta:
    primaryLabel: Tell us where it drops out
    primaryHref: '#contact'
    phoneLabel: Call for Wi-Fi help
  symptoms: []
  diagnosis: {}
  inclusions: []
  process: []
  proofPoints: []
  faqs: []
  form:
    heading: Tell us what is happening
    contextKey: wifi_dropouts
  schema:
    serviceType: Wi-Fi diagnosis and support
    areaServed: [Ivanhoe, Eaglemont]
```

**Subtasks:**

- [x] Mark every required and optional field.
- [x] Set minimum/maximum item counts: three symptoms, three process steps, three proof points, three to six FAQs.
- [x] Require unique SEO title, description, H1 and canonical route.
- [x] Require an approved offer and explicit exclusions.
- [x] Prohibit unsupported testimonials, guarantees and urgency claims.
- [x] Document tone override: security/scam pages use calm copy rather than cheeky labels.

**Exit criterion:** Another agent can create a page without inspecting an unrelated landing-page file.

## P1-T2 — Add base-layout support for page-specific social metadata

**Modify:** `src/_includes/layouts/base.njk:35-53`

**Subtasks:**

- [x] Add `ogImage`, `ogImageWidth`, and `ogImageHeight` overrides with current defaults as fallback.
- [x] Preserve existing canonical URL behaviour.
- [x] Add tests confirming a fixture page renders its own OG image and description.
- [x] Do not add campaign scripts inline separately on every page.

**Exit criterion:** Landing pages can produce problem-specific link previews without changing global defaults.

## P1-T3 — Extract and secure the shared contact-form component

**Create:** `src/_includes/components/contact-form.njk`<br>
**Modify:** `src/contact.njk:28-95`<br>
**Reference:** `https://forms.digitalsanctum.com.au/f/nakedtech-contact`

**Subtasks:**

- [x] Move the reusable iframe and resize/submission handler into a component.
- [x] Accept page-provided heading, introduction and `pain_point` context.
- [x] Validate `e.origin === 'https://forms.digitalsanctum.com.au'` before processing messages.
- [x] Preserve the successful `sanctum-forms:resize` behaviour.
- [x] Preserve exactly one Meta `Lead` and one GA4 `generate_lead` event per successful submission.
- [x] Move phone-click tracking to a single sitewide or template-level handler so it is not duplicated.
- [x] Render the component on `/contact/` and on the fixture landing page.
- [x] Verify both locations resize and submit correctly; use a clearly labelled test submission and avoid retaining test data where deletion would require unapproved destructive action.

**Investigation result:** The current public Sanctum Forms output emits only trusted resize/submitted messages and has no supported query/default/hidden-field mapping for `pain_point`, UTMs or page path. Parent analytics carries page context; stored form attribution and `form_start` remain deferred to P4-T2 rather than being invented.

**Fixture dependency resolution:** Until P1-T4/P1-T5 create the shared layout and formal route, `scripts/site-audit.mjs` renders the component inside a non-public in-memory landing fixture and executes its integration script with simulated trusted/untrusted messages. `/contact/` was also verified with the real cross-origin form and a clearly labelled retained test submission.

**Exit criterion:** Contact and landing pages share one secure integration, with no duplicate event firing.

## P1-T4 — Create the shared sales landing-page layout

**Create:** `src/_includes/layouts/sales-landing-page.njk`

**Required section IDs:**

1. `#offer` — exact problem, local relevance, approved starting offer, dual CTA
2. `#symptoms` — recognisable self-identification
3. `#diagnosis` — what will be assessed and why diagnosis precedes hardware
4. `#included` — scope and deliverables
5. `#process` — three clear steps
6. `#proof` — truthful trust evidence
7. `#pricing` — price, inclusions and exclusions
8. `#faq` — problem-specific objections
9. `#contact` — shared form and telephone CTA

**Subtasks:**

- [ ] Implement a mobile-first hero with the exact pain above the fold.
- [ ] Keep the phone number available without making the user leave the page.
- [ ] Make `Learn More`/form progression the primary paid-social path; retain phone as an immediate option.
- [ ] Reuse existing Tailwind tokens: `skin-bone`, `ivanhoe-slate`, `electric-peach`, `electric-peach-ink`.
- [ ] Preserve one H1 and logical H2/H3 hierarchy.
- [ ] Keep touch targets at least 44px high and visible focus states.
- [ ] Render approved trust evidence only.
- [ ] Render Service JSON-LD from page data and ensure valid JSON escaping.
- [ ] Add page-view analytics once per page using the analytics contract.
- [ ] Avoid hiding essential content behind animation or JavaScript.

**Exit criterion:** The layout renders all required sections from structured data and remains usable without client-side JavaScript.

## P1-T5 — Add a fixture and automated landing-page audit

**Create temporarily:** `src/landing-pages/template-fixture.njk`<br>
**Modify:** `scripts/site-audit.mjs`

**Subtasks:**

- [ ] Create a noindex fixture with complete synthetic non-public copy.
- [ ] Add the fixture route to a dedicated landing-page audit list, not the public sitemap.
- [ ] Assert exactly one H1.
- [ ] Assert every required section ID is present.
- [ ] Assert primary CTA, telephone link and form iframe are present.
- [ ] Assert unique title, description, canonical and OG image.
- [ ] Parse and validate JSON-LD as JSON.
- [ ] Assert no common mojibake markers.
- [ ] Run `npm run test`; expect a full pass.
- [ ] Remove the fixture before the first production page is deployed, while retaining reusable audit helpers.

**Exit criterion:** The template contract is enforced by the build audit rather than agent memory.

---

# Phase 2 — Wi-Fi pilot landing page

**Objective:** Prove the full sales template with the strongest current Meta-compatible pain point before creating other pages.

## P2-T1 — Approve the Wi-Fi offer and claims

**Reference:** `src/_data/services.json:2-43`

**Decisions required:**

- [ ] Confirm the diagnostic-first starting price.
- [ ] Confirm no-call-out geography.
- [ ] Confirm whether diagnosis can be booked without committing to Mesh hardware.
- [ ] Approve “since 2004” experience wording or omit it.
- [ ] Identify any current reviews that may be used with permission.

**Exit criterion:** Every commercial claim has an owner-approved source.

## P2-T2 — Create page content

**Create:** `src/landing-pages/wifi-dropouts.njk`<br>
**Permalink:** `/wifi-dropouts-ivanhoe/index.html`

**Required message:**

> Diagnose whether the fault is the NBN service, router, placement, interference or coverage before recommending hardware.

**Subtasks:**

- [ ] Write exact pain H1 and local subheading.
- [ ] Write three symptom cards: room dropouts, intermittent/cutting-out connection, extenders or multiple network names.
- [ ] Explain the diagnostic sequence without promising a fix that depends on third parties.
- [ ] Define inclusions for the first visit.
- [ ] Explain when Mesh is and is not appropriate.
- [ ] Write pricing and exclusions in approved language.
- [ ] Write three to six FAQs using customer language.
- [ ] Add a unique, honest OG image or use the existing default until a specific creative is approved.
- [ ] Set `landing.id: wifi_dropouts` and page-specific analytics values.

**Exit criterion:** Copy answers exact problem, price, process, trust and next-step questions without forcing a Mesh sale.

## P2-T3 — Integrate navigation, sitemap and audit

**Modify:**
- `src/sitemap.njk`
- `scripts/site-audit.mjs`
- Optional relevant links: `src/services.njk` and/or `src/_data/services.json`

**Subtasks:**

- [ ] Add the canonical route to the sitemap.
- [ ] Add route and landing-section assertions to the site audit.
- [ ] Add at least one relevant internal link from the existing Wi-Fi service ecosystem.
- [ ] Do not replace `/services/full-strip/`; clarify the relationship between diagnosis and full Mesh installation.
- [ ] Verify all internal links resolve.

**Exit criterion:** The page is discoverable, indexed appropriately and connected to the existing service architecture.

## P2-T4 — Local and responsive verification

**Commands:**

- `npm run test`
- `npm run build`
- `npm start` for browser verification

**Viewport checks:** 360px, 390px, 768px, 1280px.

**Subtasks:**

- [ ] Verify the ad promise, location, starting offer and CTA are visible without scrolling on common mobile sizes.
- [ ] Verify no content overlaps, truncates or produces horizontal scrolling.
- [ ] Verify telephone links and form interaction.
- [ ] Verify keyboard navigation, focus state and heading order.
- [ ] Verify browser console contains no errors.
- [ ] Verify Pixel/GA events fire once with `wifi_dropouts`.
- [ ] Capture desktop and mobile screenshots for review.

**Exit criterion:** All automated and manual checks pass.

## P2-T5 — User visual and sales review checkpoint

**Status after implementation:** `Awaiting user review`

- [ ] Present only the Wi-Fi pilot page and evidence.
- [ ] Do not start the slow-computer page until the user approves the core landing-page structure.
- [ ] If the user rejects the structure, revise the template rather than patching the same issue separately on future pages.

**Exit criterion:** Explicit approval of template structure, offer hierarchy and visual treatment.

---

# Phase 3 — Slow computer and Windows landing page

**Objective:** Demonstrate that a second pain page can be produced by changing structured content rather than duplicating layout code.

## P3-T1 — Decide one page versus two

- [ ] Review whether “slow computer” and “Windows 10 support ended” share one buyer journey.
- [ ] Default to one page at `/slow-computer-help-ivanhoe/` with a Windows lifecycle section.
- [ ] Create a separate Windows 10 page only if query/ad evidence shows a distinct promise and conversion path.

## P3-T2 — Create the page

**Create:** `src/landing-pages/slow-computer-help.njk`<br>
**Permalink:** `/slow-computer-help-ivanhoe/index.html`

**Required content:**

- [ ] Slow startup, freezing, storage/update problems and background clutter symptoms.
- [ ] Malware/security check described without claiming every slow device has malware.
- [ ] Windows 11 compatibility and Windows 10 end-of-support decision support.
- [ ] Repair/upgrade/replace decision framework.
- [ ] Data transfer and replacement setup where appropriate.
- [ ] Approved starting price and exclusions.
- [ ] Clear statement that not every fault can be fixed in one visit.

## P3-T3 — Verify unchanged template contract

- [ ] Add route to sitemap and audit.
- [ ] Run full tests and build.
- [ ] Confirm no template branch was added solely for this page unless genuinely required.
- [ ] Verify `slow_computer` analytics parameters.
- [ ] Complete desktop/mobile browser checks.

**Exit criterion:** The second page ships through the shared template with no copied layout markup.

---

# Phase 4 — Funnel attribution and form context

**Objective:** Prove that a visitor can be followed from advertisement to landing page to contact action without overstating conversions.

## P4-T1 — UTM and event verification matrix

Create a test matrix covering:

- [ ] Facebook Wi-Fi URL with `utm_content=wifi_dropouts_v1`
- [ ] Facebook slow-PC URL with `utm_content=slow_computer_v1`
- [ ] Organic direct visit with no UTMs
- [ ] Telephone click
- [ ] Form start
- [ ] Successful form submission

For each, record expected GA4 and Meta events and parameters.

## P4-T2 — Preserve pain context through the form

- [ ] Inspect Sanctum Forms capabilities before changing schemas.
- [ ] Prefer a hidden/default `pain_point` field only if officially supported and verified.
- [ ] Preserve UTMs in analytics even if the external form cannot store them.
- [ ] Avoid creating multiple nearly identical forms unless a single form cannot carry the required context.
- [ ] Verify notification or submission data identifies the problem context where technically possible.

## P4-T3 — End-to-end verification

- [ ] Verify Events Manager receives `ViewContent`, `Contact`, and `Lead` as designed.
- [ ] Verify GA4 DebugView receives `view_service`, `phone_click`, `form_start`, and `generate_lead` as designed.
- [ ] Confirm each event fires once.
- [ ] Confirm the `postMessage` origin check rejects messages from other origins.
- [ ] Document actual evidence in `docs/marketing/landing-page-analytics-contract.md`.

**Exit criterion:** Tracking distinguishes page view, phone click and submitted lead, with page-level pain context.

---

# Phase 5 — Meta two-concept experiment

**Objective:** Test pain/offer resonance without fragmenting the local audience or remaining budget.

## P5-T1 — Build matching creative briefs

**Create:** `docs/marketing/meta-test-01-creative-brief.md`

### Concept A — Wi-Fi dropouts

- [ ] One pain only: unreliable Wi-Fi in rooms where people actually use it.
- [ ] Promise diagnosis before hardware.
- [ ] Destination `/wifi-dropouts-ivanhoe/` with unique UTMs.
- [ ] CTA defaults to `Learn More`; telephone remains available on page.

### Concept B — Slow computer / Windows

- [ ] One pain only: chronically slow Windows computer and uncertainty about repair versus replacement.
- [ ] Destination `/slow-computer-help-ivanhoe/` with unique UTMs.
- [ ] CTA defaults to `Learn More`.

**Guardrails:**

- [ ] Do not list unrelated services in either primary text.
- [ ] Do not imply private knowledge about the viewer.
- [ ] Do not use fear-heavy security claims.
- [ ] Use problem imagery rather than a generic catalogue image where practical.

## P5-T2 — Campaign structure and budget

- [ ] Keep one local Leads campaign and one Ivanhoe/Eaglemont ad set unless Ads Manager constraints require a controlled experiment container.
- [ ] Run only the two approved concepts.
- [ ] Use an A/B test with equal budget or sequential fixed-spend windows; do not allow an opaque early delivery bias to consume nearly all spend on one concept.
- [ ] Initial allocation: approximately $40 per concept, subject to user approval.
- [ ] Keep the old generic ad inactive.
- [ ] Save screenshots/export of final settings before publishing.

## P5-T3 — Pre-launch checks

- [ ] Both destination URLs return 200 and render correctly on mobile.
- [ ] UTMs remain after navigation.
- [ ] Pixel and GA4 events fire once.
- [ ] Form submits and phone links work.
- [ ] Ad preview text and landing H1 visibly match.
- [ ] Budget, geography, objective and schedule are recorded.
- [ ] User explicitly approves launch.

**Exit criterion:** Both concepts are live only after message match and event flow are verified.

---

# Phase 6 — Measurement and decision

**Objective:** Make the next decision from funnel evidence rather than isolated clicks or anecdote.

## P6-T1 — Reporting cadence

- [ ] Check delivery/technical health after 24 hours without rewriting creative.
- [ ] Perform first performance review after 48–72 hours.
- [ ] Avoid repeated intra-day changes that reset delivery or contaminate the comparison.
- [ ] Export ad-level metrics using the required column set from the strategy report.

## P6-T2 — Diagnostic funnel

Analyse in this order:

1. Impressions → outbound clicks: creative/problem resonance
2. Outbound clicks → landing-page views: load/redirect quality
3. Landing-page views → phone/form actions: offer, trust and CTA quality
4. Contact actions → qualified jobs: sales quality and unit economics

**Directional—not universal—review flags:**

- Link CTR below roughly 0.8% after a meaningful impression sample: revisit creative/problem framing.
- Landing-page views below roughly 75% of outbound clicks: investigate speed, redirects and browser failure.
- No phone/form action after 30+ landing-page views: inspect offer, trust and CTA friction.
- Zero leads after fewer than 45 clicks: insufficient evidence at an assumed 5% conversion rate.

## P6-T3 — Decision record

**Create:** `docs/marketing/meta-test-01-results.md`

Choose one explicit outcome per concept:

- `Scale cautiously`
- `Keep page; revise creative`
- `Keep creative; revise offer/page`
- `Move to search/SEO only`
- `Stop — service economics or demand do not support it`

Record spend, sample size, funnel ratios, lead quality and rationale.

**Exit criterion:** The next build/ad decision is traceable to measured evidence.

---

# Phase 7 — Organic and search expansion

**Objective:** Expand the reusable page system only where service delivery and intent justify it.

## Candidate order

1. Scam and computer-security help
2. New computer setup and data transfer
3. Printer and email support
4. Laptop not starting / black-screen triage
5. Physical screen/charging repair only after workshop-model approval

## Per-page repeatable checklist

- [ ] Confirm operational scope and unit economics.
- [ ] Confirm whether Meta, Google Search or organic SEO is the correct acquisition channel.
- [ ] Approve claims, price and service area.
- [ ] Create one page-data file using the existing schema.
- [ ] Add sitemap, internal link and audit route.
- [ ] Run `npm run test` and `npm run build`.
- [ ] Verify mobile, desktop, analytics and form context.
- [ ] Obtain visual/content approval.
- [ ] Do not create cloned suburb pages without genuinely distinct local value.

---

## Files likely to change

| File | Planned action | Purpose |
|---|---|---|
| `src/_includes/layouts/base.njk` | Modify | Charset first, social metadata overrides, consolidated analytics support |
| `src/_includes/layouts/sales-landing-page.njk` | Create | Shared modern conversion template |
| `src/_includes/components/contact-form.njk` | Create | Reusable, origin-validated form integration |
| `src/contact.njk` | Modify | Use shared form and avoid duplicate event code |
| `src/landing-pages/wifi-dropouts.njk` | Create | Wi-Fi pilot content/data |
| `src/landing-pages/slow-computer-help.njk` | Create | Slow PC/Windows content/data |
| `src/sitemap.njk` | Modify | Add approved landing routes |
| `scripts/site-audit.mjs` | Modify | Charset, mojibake, landing contract and route checks |
| `docs/marketing/landing-page-content-schema.md` | Create | Stable page-authoring contract |
| `docs/marketing/landing-page-analytics-contract.md` | Create | Stable event/UTM contract and evidence |
| `docs/marketing/meta-test-01-creative-brief.md` | Create | Approved two-concept campaign inputs |
| `docs/marketing/meta-test-01-results.md` | Create later | Decision record after measured spend |

---

## Global acceptance criteria

- [ ] No generated page contains visible mojibake.
- [ ] Charset is declared within the first 1,024 bytes of generated HTML.
- [ ] Every pain page has one H1, unique title, unique description and canonical URL.
- [ ] Every pain page renders all required conversion sections.
- [ ] Every page remains usable with JavaScript disabled except the external form submission itself.
- [ ] Phone and form CTAs work on mobile and desktop.
- [ ] Meta and GA4 events fire exactly once per intended action.
- [ ] Sanctum Forms messages are accepted only from the trusted origin.
- [ ] No unsupported price, testimonial, guarantee or service-area claim is published.
- [ ] The Wi-Fi pilot is approved before the template is reused.
- [ ] No more than two paid concepts run in the first experiment.
- [ ] `npm run test` and `npm run build` pass before any deployment.
- [ ] The user explicitly approves commit, push, deployment and ad launch actions.

---

## Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Landing template becomes a second generic service page | Message match remains weak | Require exact pain, offer and page ID in the data contract |
| Many pages create token/context bloat | Future agents load unrelated copy | Individual page files; read only current page plus shared template |
| Meta spend fragments across concepts | No concept receives a meaningful sample | One ad set; two concepts maximum; equal or sequential spend |
| Mesh price frightens diagnostic traffic | Clicks fail before enquiry | Lead with approved first-hour diagnosis; Mesh only if needed |
| Form cannot carry page/UTM context | Lead attribution remains ambiguous | Verify Forms capability; preserve context in analytics; avoid guessing |
| Duplicate Pixel events | Results overcounted | One shared handler and explicit one-event verification |
| Scam page overpromises recovery | Trust/legal harm | Clear service boundary and government/bank escalation guidance |
| Historical testimonials are stale | Misleading proof | Use current reviews or approved experience/process proof |
| New pages become suburb doorway pages | SEO quality risk | Serve real areas and write materially distinct local value only |
| Agent resumes from chat history | Token bloat and stale assumptions | Use this plan, strategy report and target files as sole restart context |

---

## Progress Log

Keep entries to a maximum of eight lines per session.

```text
YYYY-MM-DD — Phase/task:
- State before:
- Files changed:
- Verification:
- Decision:
- Blocker/open question:
- Next task:
```

### Initial entry

```text
2026-07-28 — Planning complete
- State before: campaign inactive; repository main was clean before documentation writes
- Files created: canonical strategy report, Obsidian report copy, this implementation plan
- Verification: archival crawl 326/326 successful; campaign CSV analysed
- Decision: diagnostic-first Wi-Fi pilot, then slow PC/Windows; two Meta concepts maximum
- Blocker/open question: price/claims/form-context details require approval during named phases
- Next task: P0-T1
```

```text
2026-07-28 — Phase 0 complete
- State before: branch main; tree not clean (untracked plan/docs); Meta campaign Off
- Files changed: plan, base layout, site audit, analytics contract; CSV preserved in Downloads (SHA-256 fa56444123a2999aa4cf94f928f63d8ed92f007f4935006356a41e996134f04e)
- Verification: Ads Manager Off; CSV has no click/LPV columns; charset test failed before fix then `npm run test` passed; `/contact/` and `/services/full-strip/` browser checks passed
- Baseline: spend $18.84; impressions 2,163; reach 592; frequency 3.65; CPM $8.71; no reported result
- Decision: campaign left inactive; missing metrics not inferred; shared analytics event vocabulary fixed before implementation
- Deferred: production `Content-Type` check after approved deployment; local server returns `text/html; charset=utf-8`
- Next task: P1-T1
```

```text
2026-07-28 — P1-T1–P1-T2 complete
- State before: Phase 1 not started; current task P1-T1
- Files changed: content schema, base metadata layout, site audit and canonical plan
- Contract: thin front matter; fixed field shapes/counts; approval/calm-tone gates; page-level OG image/dimension overrides
- Verification: metadata audit failed first on four override assertions, then passed; `npm run test` passed (348 checks/15 pages); `npm run build` and `git diff --check` passed
- Decision: shared layout owns rendering and social defaults; thin pages may override approved problem metadata without duplicating scripts
- Blocker/open question: named commercial claims and form-context capability remain deferred to their plan tasks
- Next task: P1-T3
```

```text
2026-07-28 — P1-T3 complete
- State before: shared form, resize/submission and telephone tracking were page-local in `src/contact.njk`
- Files changed: shared contact-form component, contact page, base layout, site audit, analytics contract and canonical plan
- Verification: failure-first audit reported 5 issues/349 passes; final `npm run test` passed 379 checks/15 pages
- Browser: `/contact/` resized to 858px; wrong-origin resize was rejected; one labelled test submission produced one Meta `Lead` and one GA4 `generate_lead`
- Decision: one component owns trusted form messages; base layout owns telephone events; non-public in-memory fixture bridges the P1-T4/P1-T5 dependency
- Limitation: Forms exposes no supported context-field or form-start message; defer stored attribution/form-start to P4-T2
- Next task: P1-T4
```
