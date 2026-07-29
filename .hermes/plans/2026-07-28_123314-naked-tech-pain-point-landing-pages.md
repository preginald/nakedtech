# Naked Tech Pain-Point Landing Pages and Paid Campaign Implementation Plan

> **For Hermes:** Execute this plan one phase at a time. Load `web-frontend-development`, `facebook-ads`, and `social-media-ad-readiness-audit` before implementation. Use `parallel-plan-execution` only for genuinely independent tasks. Do not re-run the historical research or reload old sessions unless the canonical report identifies a missing fact.

**Goal:** Build a reusable Nunjucks sales-landing-page system, launch the first two problem-specific pages, instrument the complete conversion funnel, and run a controlled low-budget Meta experiment without fragmenting spend or session context.

**Architecture:** Individual problem pages will be thin Nunjucks files under `src/landing-pages/` that supply structured page data to one shared nested layout at `src/_includes/layouts/sales-landing-page.njk`. The shared layout will own conversion structure, accessibility, trust, CTA placement and analytics conventions; each page will own only problem-specific copy, offer, FAQs, SEO metadata and campaign identifiers. Existing Eleventy, Tailwind, Sanctum Forms, Meta Pixel and GA4 infrastructure will be extended rather than replaced.

**Tech Stack:** Eleventy 3.1, Nunjucks 3.2, Tailwind CSS 3.4, Node site audit, Sanctum Forms iframe/postMessage integration, Meta Pixel, GA4.

**Canonical strategy:** `docs/marketing/2026-07-28-facebook-campaign-and-landing-page-strategy.md`<br>
**Obsidian copy:** `Sanctum Digital/Projects/Naked Tech/Naked Tech - Facebook Campaign and Landing Page Strategy - 2026-07-28.md`<br>
**Created:** 28 July 2026 12:33 AEST<br>
**Status:** Phase 4 complete; P4-T3 passed
**Current phase:** Phase 5 not started
**Next task:** P5-T1 — build matching creative briefs only after a new-session scope check

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
| 1. Reusable Nunjucks landing-page system | Complete | Data contract, metadata overrides, secure shared form, shared sales layout and reusable full-page audit verified | Phase 2 |
| 2. Wi-Fi pilot landing page | Complete | User approved the responsive pilot, offer hierarchy and visual treatment; 477 audit checks passed | Phase 3 |
| 3. Slow computer / Windows landing page | Complete | Page verified using unchanged template contract | Phase 4 |
| 4. Funnel attribution and form context | Complete | P4-T1 matrix, P4-T2/P4-T2a persistence and delivery, and P4-T3 live GA4/Meta evidence passed | Phase 5 |
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

### Commercial decisions and gates

- The Wi-Fi diagnostic is an approved `$190 fixed-price project`, not an hourly engagement.
- Naked Tech's approved business-wide pricing policy is per project rather than hourly; legacy hourly, minimum-charge and time-block wording on the existing service pages must be normalised to fixed-scope project language.
- A short suitability call may be free; the skilled onsite diagnosis is not free and is not automatically credited to later work.
- “Peter has supported home computer users since 2004” is approved.
- Ivanhoe and Eaglemont both share the no-call-out policy.
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

Each page declares an explicit permalink, such as `/services/wifi-dropouts-ivanhoe/index.html`, and sets `layout: layouts/sales-landing-page.njk`.

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

- [x] Implement a mobile-first hero with the exact pain above the fold.
- [x] Keep the phone number available without making the user leave the page.
- [x] Make `Learn More`/form progression the primary paid-social path; retain phone as an immediate option.
- [x] Reuse existing Tailwind tokens: `skin-bone`, `ivanhoe-slate`, `electric-peach`, `electric-peach-ink`.
- [x] Preserve one H1 and logical H2/H3 hierarchy.
- [x] Keep touch targets at least 44px high and visible focus states.
- [x] Render approved trust evidence only.
- [x] Render Service JSON-LD from page data and ensure valid JSON escaping.
- [x] Add page-view analytics once per page using the analytics contract.
- [x] Avoid hiding essential content behind animation or JavaScript.

**Exit criterion:** The layout renders all required sections from structured data and remains usable without client-side JavaScript.

## P1-T5 — Add a fixture and automated landing-page audit

**Create temporarily:** `src/landing-pages/template-fixture.njk`<br>
**Modify:** `scripts/site-audit.mjs`

**Subtasks:**

- [x] Create a noindex fixture with complete synthetic non-public copy.
- [x] Add the fixture route to a dedicated landing-page audit list, not the public sitemap.
- [x] Assert exactly one H1.
- [x] Assert every required section ID is present.
- [x] Assert primary CTA, telephone link and form iframe are present.
- [x] Assert unique title, description, canonical and OG image.
- [x] Parse and validate JSON-LD as JSON.
- [x] Assert no common mojibake markers.
- [x] Run `npm run test`; expect a full pass.
- [x] Remove the fixture before the first production page is deployed, while retaining reusable audit helpers.

**Exit criterion:** The template contract is enforced by the build audit rather than agent memory.

---

# Phase 2 — Wi-Fi pilot landing page

**Objective:** Prove the full sales template with the strongest current Meta-compatible pain point before creating other pages.

## P2-T1 — Approve the Wi-Fi offer and claims

**Reference:** `src/_data/services.json:2-43`

**Decisions required:**

- [x] Confirm the Wi-Fi diagnostic-first starting price.
- [x] Confirm no-call-out geography: Ivanhoe and Eaglemont.
- [x] Confirm diagnosis can be booked without committing to Mesh hardware.
- [x] Approve “since 2004” experience wording.
- [x] Confirm no current reviews are available for use at this stage.

**Owner decisions recorded 28 July 2026:** The pilot is specifically a Wi-Fi dropout/dead-zone diagnostic covering the NBN service, router, placement, interference and coverage before hardware is recommended. The onsite diagnosis is a `$190 fixed-price project`, not free or hourly; a short suitability call may be free, and the diagnostic fee is not automatically credited to later work. Diagnosis is available without a Mesh commitment, the no-call-out area is Ivanhoe and Eaglemont, “since 2004” is approved, and no review content will be used.

**Exit criterion:** Every commercial claim has an owner-approved source.

## P2-T2 — Create page content

**Create:** `src/landing-pages/wifi-dropouts.njk`<br>
**Permalink:** `/services/wifi-dropouts-ivanhoe/index.html`

**Required message:**

> Diagnose whether the fault is the NBN service, router, placement, interference or coverage before recommending hardware.

**Subtasks:**

- [x] Write exact pain H1 and local subheading.
- [x] Write three symptom cards: room dropouts, intermittent/cutting-out connection, extenders or multiple network names.
- [x] Explain the diagnostic sequence without promising a fix that depends on third parties.
- [x] Define inclusions for the first visit.
- [x] Explain when Mesh is and is not appropriate.
- [x] Write pricing and exclusions in approved language.
- [x] Write three to six FAQs using customer language.
- [x] Add a unique, honest OG image or use the existing default until a specific creative is approved.
- [x] Set `landing.id: wifi_dropouts` and page-specific analytics values.

**Exit criterion:** Copy answers exact problem, price, process, trust and next-step questions without forcing a Mesh sale.

## P2-T3 — Integrate navigation, sitemap and audit

**Modify:**
- `src/sitemap.njk`
- `scripts/site-audit.mjs`
- Optional relevant links: `src/services.njk` and/or `src/_data/services.json`

**Subtasks:**

- [x] Add the canonical route to the sitemap.
- [x] Add route and landing-section assertions to the site audit.
- [x] Add at least one relevant internal link from the existing Wi-Fi service ecosystem.
- [x] Do not replace `/services/full-strip/`; clarify the relationship between diagnosis and full Mesh installation.
- [x] Verify all internal links resolve.

**Exit criterion:** The page is discoverable, indexed appropriately and connected to the existing service architecture.

## P2-T4 — Local and responsive verification

**Commands:**

- `npm run test`
- `npm run build`
- `npm start` for browser verification

**Viewport checks:** 360px, 390px, 768px, 1280px.

**Subtasks:**

- [x] Verify the ad promise, location, starting offer and CTA are visible without scrolling on common mobile sizes.
- [x] Verify no content overlaps, truncates or produces horizontal scrolling.
- [x] Verify telephone links and form interaction.
- [x] Verify keyboard navigation, focus state and heading order.
- [x] Verify browser console contains no errors.
- [x] Verify Pixel/GA events fire once with `wifi_dropouts`.
- [x] Capture desktop and mobile screenshots for review.

**Exit criterion:** All automated and manual checks pass.

## P2-T5 — User visual and sales review checkpoint

**Status after implementation:** `Complete`

- [x] Present only the Wi-Fi pilot page and evidence.
- [x] Do not start the slow-computer page until the user approves the core landing-page structure.
- [x] User confirmed the template structure, offer hierarchy and visual treatment on 28 July 2026; no template revision was required.

**Exit criterion:** Explicit approval of template structure, offer hierarchy and visual treatment.

---

# Phase 3 — Slow computer and Windows landing page

**Objective:** Demonstrate that a second pain page can be produced by changing structured content rather than duplicating layout code.

**Status:** `Complete` — P3-T1 through P3-T3 completed 29 July 2026.

## P3-T1 — Decide one page versus two

- [x] Review whether “slow computer” and “Windows 10 support ended” share one buyer journey.
- [x] Default to one page at `/services/slow-computer-help-ivanhoe/` with a Windows lifecycle section.
- [x] Create a separate Windows 10 page only if query/ad evidence shows a distinct promise and conversion path.

**Decision recorded 28 July 2026:** Use one `/services/slow-computer-help-ivanhoe/` page. The two entry triggers converge on the same assessment and outcome: establish device condition and Windows 11 compatibility, then explain whether repair, upgrade, an interim supported path, or replacement with data transfer/setup is proportionate. Current AU autocomplete is qualitatively split between symptom/fix language for slow computers and informational “what now/should I upgrade/compatibility check” language for Windows, but the exact local Windows-upgrade seed produced no suggestions and does not establish a separate local-service conversion path. The available Meta export is campaign-level Wi-Fi data only, so there is no slow-PC-versus-Windows ad evidence. Microsoft likewise presents Windows 10 end of support as one options workflow covering compatibility, upgrade, Extended Security Updates and replacement. Split later only if search/ad evidence demonstrates material Windows-specific demand **and** an owner-approved distinct offer and conversion path; autocomplete is not search-volume evidence.

## P3-T2 — Create the page

**Create:** `src/landing-pages/slow-computer-help.njk`<br>
**Permalink:** `/services/slow-computer-help-ivanhoe/index.html`

**Commercial gate before authoring:** Owner approval is required for the starting offer, displayed price, included work and exclusions. Do not infer these from the existing everyday-tech service or the Wi-Fi diagnostic.

**Owner approval recorded 29 July 2026:** `From $190` fixed-price diagnosis and decision project. The exact scope and price are agreed before work. It includes diagnosis, safe straightforward fixes within scope, and a repair/upgrade/replace recommendation. Parts, account recovery, data transfer/new-computer setup, provider work and follow-up are separate; there is no one-visit guarantee.

**Required content:**

- [x] Slow startup, freezing, storage/update problems and background clutter symptoms.
- [x] Malware/security check described without claiming every slow device has malware.
- [x] Windows 11 compatibility and Windows 10 end-of-support decision support.
- [x] Repair/upgrade/replace decision framework.
- [x] Data transfer and replacement setup where appropriate.
- [x] Approved starting price and exclusions.
- [x] Clear statement that not every fault can be fixed in one visit.

## P3-T3 — Verify unchanged template contract

- [x] Add route to sitemap and audit.
- [x] Run full tests and build.
- [x] Confirm no template branch was added solely for this page unless genuinely required.
- [x] Verify `slow_computer` analytics parameters.
- [x] Complete desktop/mobile browser checks.

**Exit criterion:** The second page ships through the shared template with no copied layout markup.

---

# Phase 4 — Funnel attribution and form context

**Objective:** Prove that a visitor can be followed from advertisement to landing page to contact action without overstating conversions.

## P4-T1 — UTM and event verification matrix

Create a test matrix covering:

- [x] Facebook Wi-Fi URL with `utm_content=wifi_dropouts_v1`
- [x] Facebook slow-PC URL with `utm_content=slow_computer_v1`
- [x] Organic direct visit with no UTMs
- [x] Telephone click
- [x] Form start
- [x] Successful form submission

For each, record expected GA4 and Meta events and parameters.

**P4-T1 evidence:** `scripts/analytics-matrix.mjs` executes the exact scripts from clean generated pages with analytics calls intercepted locally. `npm run build && npm run audit:analytics` passed 14 scenarios and 62 assertions across both final routes. Paid views mapped the two approved `utm_content` values to `campaign_content`; no-UTM views omitted it; telephone, start and successful-submission events matched their names, page paths, pain identifiers and exact-once contracts. Protocol-v1 context handshakes carried only the four approved UTMs, while repeated trusted messages, wrong origins, wrong sources and invalid resize payloads produced no duplicates or false conversions. Full expected/observed evidence and limitations are recorded in `docs/marketing/landing-page-analytics-contract.md`.

## P4-T2 — Preserve pain context through the form

- [x] Inspect Sanctum Forms capabilities before changing schemas.
- [x] Prefer a hidden/default `pain_point` field only if officially supported and verified.
- [x] Preserve UTMs in analytics even if the external form cannot store them.
- [x] Avoid creating multiple nearly identical forms unless a single form cannot carry the required context.
- [x] Verify notification or submission data identifies the problem context where technically possible.

**P4-T2 evidence:** Production Sanctum Forms is deployed at commit `5ca4b19` with service state `active` and Alembic revision `0020 (head)`. The live `nakedtech-contact` renderer exposes protocol-v1 `ready`, `context`, `started`, `resize` and `submitted` messages, uses exact approved origins, and contains no wildcard `postMessage` target. Its dedicated `_sf_context` transport is server-sanitised into the separate non-null JSONB `submissions.context` column; it is not a respondent answer or hidden/default field. Existing production records prove persistence without creating another submission: 2 of 28 submissions had non-empty context, both for `nakedtech-contact`, with page/pain/UTM metadata kept separate. The production parent `/contact/` loaded the same form and changed its iframe from the 650px fallback to the trusted 858px reported height. Targeted provider coverage passed 73 backend tests and one frontend attribution-detail test.

**Decision:** Keep one shared `nakedtech-contact` form. Send only the documented `pain_point`, `page_path` and four UTM keys through protocol v1, retain normal analytics attribution independently, and do not add visible/hidden tracking fields or clone the form. The authenticated submission record, exports and operator surfaces identify the problem context. Provider source/tests include context in owner notification data while excluding it from respondent receipts, but cross-service verification found that the current configured owner template never renders because it is missing from Notify.

## P4-T2a — Restore owner notification delivery

- [x] Inspect the Forms admin/frontend update path before changing the instance/template configuration.
- [x] Choose the durable fix: add the intended tracked `general-contact-notification` Notify template or deliberately migrate the form to a verified existing owner template.
- [x] Render the separate attribution context in the owner email while keeping it out of respondent receipts.
- [x] Add Notify template coverage for answers, attribution, escaping and missing optional context.
- [x] After explicit deployment approval, run one labelled submission and verify the Notify row reaches `sent`, not merely that Forms receives HTTP 202.

**Root cause and durable choice:** The configured `general-contact-notification` slug exists only in production data: it is absent from both repositories and their histories, and is not in Forms' official `NOTIFY_TEMPLATE_SLUGS` catalogue. Codifying that ghost slug would preserve configuration drift. The durable path is to use the official `form-submission` owner template, which is already the Forms default and catalogue entry, and make that template render the separate context object.

**Local remediation evidence:** `/home/preginald/Dev/sanctum-notify/sanctum_notify/templates/form-submission.html` now renders an optional, separately labelled Attribution table without changing respondent answer rendering. `tests/test_template_service.py` covers required answers, full pain/page/UTM context, absent/empty context and HTML escaping. The focused class passed 13 tests; the full Notify suite passed 269 with 3 skipped; repository-wide Ruff check and format check passed. A rendered Naked Tech preview had separate readable Submission details and Attribution tables with zero horizontal overflow. The Forms frontend's actual path is `TemplateEditorPage.jsx` → `PATCH /api/v1/templates/{id}` to create a new version, followed by `TemplateDetailPage.jsx` → `POST /api/v1/templates/{template_id}/upgrade/{instance_id}` to move the pinned `nakedtech-contact` instance from its current version 1.

**Production evidence:** Notify commit `06d8470` was pushed, present in the production checkout, restarted cleanly and returned a healthy database/dispatcher state. A production-side render probe confirmed the deployed `form-submission` template includes the Attribution section and all supplied context values. Through the authenticated Forms frontend API path, `Naked Tech Contact` was updated from v1 to v2 with `notify_template_id: form-submission`, and the live `nakedtech-contact` instance was explicitly upgraded while retaining its four fields, one owner recipient, active status, endpoint and origin allowlist. One labelled submission (`6b70ef82-9b48-418a-8718-697cc4a62960`) persisted the full pain/page/four-UTM context. Its corresponding Notify row (`7c9bd7f7-6fb0-42b7-af20-7d24ce983014`) used `form-submission`, retained the same context and reached final status `sent` with no error. The historical dead-letter rows remain as evidence and were not deleted.

## P4-T3 — End-to-end verification

- [x] Verify Events Manager receives `ViewContent`, `Contact`, and `Lead` as designed.
- [x] Verify GA4 DebugView receives `view_service`, `phone_click`, `form_start`, and `generate_lead` as designed.
- [x] Confirm each event fires once.
- [x] Confirm the `postMessage` origin check rejects messages from other origins.
- [x] Document actual evidence in `docs/marketing/landing-page-analytics-contract.md`.

**Production evidence:** Naked Tech commit `dc6f93e` deployed successfully through GitHub Actions run `30418774880`. During the controlled 14:01:36–14:02:21 AEST window, GA4 DebugView for property `547079333` received `view_service` ×2 and `phone_click`, `form_start`, `generate_lead` ×1 each. Meta Test Events for Pixel `1010322558552545` received processed `ViewContent` ×2 and `Contact`, `Lead` ×1 each, with the expected Wi-Fi and slow-computer page/pain/campaign values. Replays plus malformed, wrong-origin and wrong-source controls added no events. One approved retained Forms row (`9cde7885-97ed-4fed-bba0-185e7261a209`) preserved the Wi-Fi path, pain and four UTMs; Notify row `ec7dfd6e-42ba-45bd-87c2-e054b20884ad` used `form-submission`, retained identical context and reached final `sent` with no error.

**Exit criterion:** Tracking distinguishes page view, phone click and submitted lead, with page-level pain context.

---

# Phase 5 — Meta two-concept experiment

**Objective:** Test pain/offer resonance without fragmenting the local audience or remaining budget.

## P5-T1 — Build matching creative briefs

**Create:** `docs/marketing/meta-test-01-creative-brief.md`

### Concept A — Wi-Fi dropouts

- [ ] One pain only: unreliable Wi-Fi in rooms where people actually use it.
- [ ] Promise diagnosis before hardware.
- [ ] Destination `/services/wifi-dropouts-ivanhoe/` with unique UTMs.
- [ ] CTA defaults to `Learn More`; telephone remains available on page.

### Concept B — Slow computer / Windows

- [ ] One pain only: chronically slow Windows computer and uncertainty about repair versus replacement.
- [ ] Destination `/services/slow-computer-help-ivanhoe/` with unique UTMs.
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
| Mesh price frightens diagnostic traffic | Clicks fail before enquiry | Lead with the approved fixed-price diagnosis; Mesh only if evidence supports it |
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

```text
2026-07-28 — P1-T4 complete
- State before: shared page-data contract and form existed; sales layout was absent
- Files changed: sales landing-page layout, shared site contact data and canonical plan
- Verification: in-memory render passed 9 section IDs, one H1, three phone links, safe JSON-LD and one page-view tracker; `npm run test` passed 398 checks/15 pages
- Decision: structured page data drives all conversion sections; private proof sources never render; essential content is server-rendered
- Blocker/open question: none for the layout; commercial claims remain gated in Phase 2
- Next task: P1-T5
```

```text
2026-07-28 — P1-T5 and Phase 1 complete
- State before: P1-T4 complete; no generated landing-page route or reusable full-page audit existed
- Files changed: base robots override, reusable site-audit helpers and canonical plan; temporary source fixture created, verified, then removed
- Contract: one H1; nine section IDs; primary CTA, telephone and iframe; unique metadata; valid Service JSON-LD; no mojibake
- Verification: generated noindex fixture passed 444 checks/16 pages; final in-memory fixture passed `npm run test` with 430 checks/15 pages
- Decision: keep the contract active in memory and register approved public routes in the dedicated audit list; no fixture route survives
- Blocker/open question: only the Wi-Fi diagnostic starting price remains; the other four P2-T1 decisions are recorded
- Next task: P2-T1 — confirm the Wi-Fi diagnostic price
```

```text
2026-07-28 — P2-T1–P2-T4 complete; P2-T5 awaiting review
- State before: Wi-Fi diagnostic scope was approved but its commercial structure was unresolved
- Files changed: Wi-Fi pilot page, sitemap, landing audit, Wi-Fi service link, shared mobile navigation/touch targets, project-pricing copy and canonical plan
- Verification: `npm run test` passed 477 checks/16 pages; responsive browser checks passed at 360/390/768/1280 with no page overflow or console errors
- Analytics/form: GA `view_service` and Meta `ViewContent` each fired once with `wifi_dropouts`; trusted form events deduplicated; live form fields accepted input without submission
- Decision: `$190 fixed-price` onsite diagnosis; optional free short triage; no automatic fee credit; no Mesh commitment; Ivanhoe and Eaglemont; no reviews
- Evidence: `/services/wifi-dropouts-ivanhoe/`; screenshots in `/home/preginald/Downloads/nakedtech-qa/`
- Next task: P2-T5 — owner review; do not start Phase 3 before approval
```

```text
2026-07-28 — P2-T5 and Phase 2 complete
- State before: responsive Wi-Fi pilot passed implementation and verification; owner review remained
- Decision: owner confirmed the template structure, `$190 fixed` offer hierarchy and visual treatment
- Verification: prior P2 evidence remains 477 checks/16 pages plus 360/390/768/1280 browser review
- Next task: P3-T1 — decide one slow-computer/Windows page versus two
```

```text
2026-07-28 — P3-T1 complete; Phase 3 in progress
- State before: combined page was the default, pending buyer-journey and evidence review
- Evidence: AU autocomplete, campaign CSV and current Microsoft lifecycle guidance reviewed
- Query/ad finding: two entry vocabularies, but no distinct local Windows offer/path or ad-level evidence
- Decision: one `/services/slow-computer-help-ivanhoe/` page with a substantive Windows lifecycle section
- Split gate: material Windows-specific search/ad demand plus an approved distinct offer and conversion path
- Blocker/open question: P3-T2 price, inclusions and exclusions require owner approval
- Next task: P3-T2 commercial approval, then author the thin page data file
```

```text
2026-07-29 — P3-T2–P3-T3 and Phase 3 complete
- State before: one combined route was approved, but the commercial offer remained gated
- Owner decision: from $190 fixed-price diagnosis/decision project; named inclusions, exclusions and no one-visit guarantee
- Files changed: thin slow-computer page data, custom OG card, sitemap/audit registration, Quickie internal link and synchronized strategy records
- Verification: 530 checks/17 pages passed; build passed; 360/390/768/1280 browser checks showed zero overflow and no console errors
- Analytics: `view_service`, `phone_click`, `ViewContent`/`Contact` wiring and form context carry `slow_computer`; campaign content preserves `slow_computer_v1`
- Decision: shared sales layout remained unchanged; Windows lifecycle stays substantive inside the one buyer journey
- Next task: P4-T1 — create and execute the UTM/event verification matrix
```

```text
2026-07-29 — Final pain-page route architecture approved
- Decision: place both durable pain pages under `/services/` while retaining the `-ivanhoe` local-intent slugs
- Canonicals: `/services/wifi-dropouts-ivanhoe/` and `/services/slow-computer-help-ivanhoe/`
- Service boundary: Ivanhoe and Eaglemont only for the foreseeable future; titles, copy and `areaServed` name both
- SEO guardrail: no cloned Eaglemont or future suburb variants without materially distinct local value and an actual service-area change
- Verification: 532 checks/17 pages passed; new routes returned 200, superseded roots 404; canonical, OG, sitemap, internal links and JSON-LD passed
- Responsive/analytics: 360/390/768/1280 showed zero overflow; `view_service`/`ViewContent` carried the new page path and UTM content exactly once
- Build safety: `prebuild` now removes `_site` so obsolete generated routes cannot survive a permalink change or deployment build
- Deployment: neither new route has been published; superseded root routes never went live and need no redirect
- Next task: verified handoff, then P4-T1 in a fresh session
```

```text
2026-07-29 — P4-T1 UTM/event matrix complete
- State before: Phase 3 complete locally; final routes undeployed; P4-T1 was next
- Files changed: analytics matrix executor, package test hook, analytics contract and canonical plan
- Verification: `npm run test` passed 532 site checks/17 pages plus 14 matrix scenarios/62 assertions; syntax and diff checks passed
- Evidence: paid/direct views, phone, form start/submission, context handshake, replay and trust-boundary controls covered on both routes
- Limitation: local parent-script interception only; no real submission or GA4/Meta platform evidence claimed
- Next task: P4-T2 — inspect current Forms provider behaviour and persisted submission context before changes
```

```text
2026-07-29 — P4-T2 Forms context capability inspection complete
- State before: parent protocol was locally verified; production provider receipt/persistence remained unproven
- Production: Forms commit `5ca4b19`, service active, migration `0020 (head)`; live child exposes the complete exact-origin v1 contract
- Persistence: 2/28 existing submissions have separate context, both `nakedtech-contact`; answers and attribution remain separate
- Verification: 73 backend provider tests and one frontend attribution-detail test passed; live `/contact/` resized 650px → 858px
- Decision: reuse one form and dedicated JSONB context; no hidden/default field, schema change or duplicate form
- Blocker: both corresponding Notify rows dead-lettered; configured `general-contact-notification` template is missing
- Next task: P4-T2a — restore/verify owner notification delivery, then P4-T3 platform evidence
```

```text
2026-07-29 — P4-T2a local owner-notification remediation ready
- Root cause: production-only `general-contact-notification` slug is absent from both repos/history and the official Forms catalogue
- Decision: migrate to official `form-submission`; do not create a template solely to legitimise stale configuration
- Notify changes: optional separate Attribution table plus tests for full/empty/missing/unsafe context
- Verification: 13 focused tests; 269 passed/3 skipped full suite; Ruff checks and rendered zero-overflow preview passed
- Forms path: template editor PATCH creates a version; template detail Upgrade moves the pinned instance to that version
- Production: unchanged and still dead-lettering; no commit, deploy, configuration mutation or test submission performed
- Next task: after explicit approval, commit/deploy Notify, migrate/upgrade the form, submit once and verify actual Notify `sent`
```

```text
2026-07-29 — P4-T2a production owner-notification repair complete
- Notify: commit `06d8470` deployed; service health and production context-render probe passed
- Forms: `Naked Tech Contact` v2 now selects official `form-submission`; live instance explicitly upgraded from v1
- Integrity: active endpoint, four fields, one owner recipient and allowed origins preserved after upgrade
- Submission: one labelled row `6b70ef82-9b48-418a-8718-697cc4a62960` persisted pain/page/four-UTM context
- Delivery: Notify row `7c9bd7f7-6fb0-42b7-af20-7d24ce983014` used `form-submission` and reached final `sent` with no error
- Historical dead letters retained; no data or test submissions deleted
- Next task: P4-T3 — collect GA4 DebugView and Meta Events Manager evidence with exact event cardinality
```

```text
2026-07-29 — P4-T3 production platform verification complete
- Release: Naked Tech `dc6f93e`; GitHub Actions run `30418774880` succeeded and both canonical routes served the new output
- GA4: DebugView property `547079333` received `view_service` ×2 and `phone_click`, `form_start`, `generate_lead` ×1 each
- Meta: Pixel `1010322558552545` received processed `ViewContent` ×2 and `Contact`, `Lead` ×1 each with correct pain/path/content
- Controls: trusted replays plus malformed, wrong-origin and wrong-source messages added zero contractual events; no browser errors
- Forms: one retained row `9cde7885-97ed-4fed-bba0-185e7261a209` stored Wi-Fi pain/path and all four approved UTMs
- Notify: row `ec7dfd6e-42ba-45bd-87c2-e054b20884ad` used `form-submission`, retained identical context and reached final `sent` with no error
- Decision: Phase 4 complete; Phase 5 remains not started pending a new-session scope check
```
