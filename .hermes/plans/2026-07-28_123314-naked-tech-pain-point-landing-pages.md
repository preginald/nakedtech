# Naked Tech Pain-Point Landing Pages and Paid Campaign Implementation Plan

> **For Hermes:** Execute this plan one phase at a time. Load `web-frontend-development`, `facebook-ads`, and `social-media-ad-readiness-audit` before implementation. Use `parallel-plan-execution` only for genuinely independent tasks. Do not re-run the historical research or reload old sessions unless the canonical report identifies a missing fact.

**Goal:** Build a reusable Nunjucks sales-landing-page system, launch the first two problem-specific pages, instrument the complete conversion funnel, and run a controlled low-budget Meta experiment without fragmenting spend or session context.

**Architecture:** Individual problem pages will be thin Nunjucks files under `src/landing-pages/` that supply structured page data to one shared nested layout at `src/_includes/layouts/sales-landing-page.njk`. The shared layout will own conversion structure, accessibility, trust, CTA placement and analytics conventions; each page will own only problem-specific copy, offer, FAQs, SEO metadata and campaign identifiers. Existing Eleventy, Tailwind, Sanctum Forms, Meta Pixel and GA4 infrastructure will be extended rather than replaced.

**Tech Stack:** Eleventy 3.1, Nunjucks 3.2, Tailwind CSS 3.4, Node site audit, Sanctum Forms iframe/postMessage integration, Meta Pixel, GA4.

**Canonical strategy:** `docs/marketing/2026-07-28-facebook-campaign-and-landing-page-strategy.md`<br>
**Obsidian copy:** `Sanctum Digital/Projects/Naked Tech/Naked Tech - Facebook Campaign and Landing Page Strategy - 2026-07-28.md`<br>
**Created:** 28 July 2026 12:33 AEST<br>
**Status:** Phase 5 launched; sequential delivery and measurement in progress
**Current phase:** Phase 5 controlled delivery
**Next task:** Preserve the approved controls, perform read-only health checks, and begin Phase 6 only after both arms and the attribution-settling window finish

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
| 5. Meta two-concept experiment | In progress | Separate owner launch approval followed the P5-T3 pass; one campaign, two ad sets and two ads were published on 30 July, with Slow Computer active and Wi-Fi scheduled at the retained zero-spend readback | Preserve controls through both delivery windows; do not optimise from early results |
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
- “Peter personally has more than 30 years of technology and support experience” is approved; do not imply that Naked Tech itself has operated for 30 years.
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

**Status:** `Complete` — both concepts, the new problem-specific imagery direction, Concept B's fixed-price onsite model/copy and all eight current placement exports are owner-approved. P5-T2 remained a separate campaign-settings and budget gate.

### Concept A — Wi-Fi dropouts

- [x] One pain only: unreliable Wi-Fi in rooms where people actually use it.
- [x] Promise diagnosis before hardware.
- [x] Destination `/services/wifi-dropouts-ivanhoe/` with unique UTMs.
- [x] CTA defaults to `Learn More`; telephone remains available on page.

### Concept B — Slow computer / Windows

- [x] One pain only: chronically slow Windows computer and uncertainty about repair versus replacement.
- [x] Destination `/services/slow-computer-help-ivanhoe/` with unique UTMs.
- [x] CTA defaults to `Learn More`.

**Guardrails:**

- [x] Do not list unrelated services in either primary text.
- [x] Do not imply private knowledge about the viewer.
- [x] Do not use fear-heavy security claims.
- [x] Use problem imagery rather than a generic catalogue image where practical.

## P5-T2 — Campaign structure and budget

**Status:** `Complete` — owner approved the revised sequential pilot at `docs/marketing/meta-test-01-campaign-structure-and-budget-proposal.md`. The unpublished/off construction checkpoint passed before a separate launch approval authorised publication on 30 July 2026.

- [x] Use one local Leads campaign with two separate Ivanhoe/Eaglemont ad-set lifetime-budget containers, as required to hold each sequential arm to its own binding budget.
- [x] Run only the two approved concepts.
- [x] Use sequential fixed-spend windows with `$45` lifetime budget per arm, Meta's live minimum; ad-set budget sharing remains Off and total authorised spend remains capped at `$90`.
- [x] Keep the old generic campaign and its existing ad set/ad inactive.
- [x] Save final campaign, ad-set, ad, creative-control and placement-warning evidence before any publication.

**P5-T3 resolution:** The owner approved the draft-only parity correction. Live readback showed Arm B's Threads value was `Use Facebook Page`; Arm A was set to the same value. Both ads now have the same sole unavailable placement, `Audience Network rewarded videos`, because the approved media is static. Both ad-set grids were also corrected from selected cells `9..17` (`09:00–18:00`) to `9..16` (`[09:00,17:00)`) Monday–Friday, with weekends empty. All edits saved as drafts; nothing was published or activated.

## P5-T3 — Pre-launch checks

- [x] Both destination URLs return successfully and render correctly on a true `390 × 844` mobile viewport.
- [x] UTMs remain after navigation.
- [x] Meta Pixel and GA4 contractual events fire once under duplicate-message and wrong-origin negative controls.
- [x] Contact-form message handling and phone-link behavior pass the deterministic live-page contract test; no external fake lead was submitted.
- [x] Ad preview text/media and landing-page H1 visibly match.
- [x] Budget, geography, objective, conversion event and exact hourly schedule grids are recorded.
- [x] User explicitly approves launch in a separate decision after the technical audit.

**Technical and launch exit criterion:** Complete. The full audit and subsequent launch addendum are recorded at `docs/marketing/meta-test-01-p5-t3-pre-launch-audit.md`. The review contained one campaign, two ad sets and two ads with no reported errors; publication completed and the retained post-publish readback showed Slow Computer active, Wi-Fi scheduled and `$0.00` spent at that checkpoint.

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
3. Printer help
4. Email and account help
5. New printer setup
6. Password safety and control
7. Laptop not starting / black-screen triage
8. Physical screen/charging repair only after workshop-model approval

## Scam/security implementation status — approved for release

- Approved route: `/services/scam-security-help-ivanhoe/`; Ivanhoe and Eaglemont remain the complete service area.
- Approved offer: `$250 fixed` for up to 90 minutes onsite, including local call-out; extended remediation and follow-up are separately scoped fixed-price projects.
- Approved mode: onsite delivery plus short business-hours telephone suitability triage; no initial remote-control support and no 24/7 or same-day-response claim.
- Approved scope: incident/exposure review, device and browser inspection, ordinary personal-account security assistance, safe actions within scope, bank/Scamwatch/ReportCyber guidance and a written priority plan.
- Approved boundaries: customer-controlled credentials and reports; no fund recovery, identity restoration, provider-controlled account recovery, forensics, law-enforcement liaison, legal/financial/insurance/credit advice or complete/future-security guarantee.
- Local implementation: thin page data, unique OG image, sitemap and services-page link, `scam_security` analytics/form context and automated audits complete; `npm test` passed 595 site checks and 21 analytics scenarios/93 assertions.
- Release boundary: visual/content approval and explicit commit/push authorisation received on 31 July 2026. Phase 5's separate Meta launch gate is unchanged.

## New-computer implementation status — owner-approved locally

- Route: `/services/new-computer-setup-data-transfer-ivanhoe/`; Ivanhoe and Eaglemont remain the complete service area.
- Offer: `$550 fixed incl. GST` for one onsite Standard Windows Move of up to three hours, one user, one healthy old Windows computer, one new Windows 11 computer and up to 250 GB.
- A current usable backup is mandatory. Peter completes the detailed suitability check with the client; the unlinked checklist is owner-operated rather than customer self-service.
- The compact `guided-service` page uses phone-first contact, the shared `nakedtech-contact` form and explicit scope, safety and overrun boundaries.
- Its unique 1200×630 service image is also rendered as a visible editorial break after the fit comparison.

## Printer-help implementation status — owner-approved locally

- Route: `/services/printer-help-ivanhoe/`; printer and email intent are now deliberately separate.
- Offer: `$190 fixed incl. GST`, including local call-out and up to 60 minutes onsite for one existing household printer, one reported fault and one primary supported device.
- Included work covers printer status, connection, queues/settings, compatible manufacturer software, safe user-level actions and verification of any completed fix. The fee covers troubleshooting rather than a guaranteed repair.
- New-printer installation, extra devices, wider network faults, physical/electrical repair, parts and consumables, provider-controlled account recovery, subscriptions and provider outages are outside the fixed scope.
- Enquiries receive a response within one business day; appointments are Monday–Friday, 9:00 am–5:00 pm, subject to availability. There is no remote-control, same-day, after-hours, weekend or emergency promise.
- The compact page uses `printer_help`, the shared contact form, a unique 1200×630 image that also appears as a visible editorial break, sitemap and internal discovery links. Current local verification passes 1,597 site checks plus 42 analytics scenarios and 186 assertions; no deployment or form submission occurred.

## Email-help implementation status — owner-approved locally

- Route: `/services/email-help-ivanhoe/`; the offer is deliberately limited to personal email, while suspected compromise routes to the Scam & Account Security Assessment.
- Offer: `$190 fixed incl. GST`, including local call-out and up to 60 minutes onsite for one reported sending, receiving, syncing or existing-account setup problem, one existing personal email account, one supported device and one supported mail app or current browser.
- Delivery is onsite after a short business-hours suitability check. The client enters all passwords, recovery details and verification codes; Naked Tech does not record or retain those email credentials.
- Password or provider-controlled recovery, lost verification methods, locked-account and identity disputes, additional accounts or devices, new-account creation, business or organisation-managed email, mail servers/DNS, provider outages and server-side or recipient-delivery decisions are excluded. Wider connectivity faults route to Wi-Fi help.
- Mail profiles are not deleted or rebuilt when mail, contacts or calendars may exist only on the device unless synchronisation or a safe backup is confirmed. Permanently deleted-email restoration is excluded, and any deletion or storage purchase remains client-controlled.
- The troubleshooting visit is not a guaranteed fix. Further work pauses for a separate fixed quote or referral; appointments are Monday–Friday, 9:00 am–5:00 pm subject to availability, with no remote-control, same-day, after-hours, weekend or emergency promise.
- The compact page uses `email_help`, the shared contact form, a unique 1200×630 image that also appears as a visible editorial break, sitemap and homepage, services, navigation, footer and Quickie discovery links. Local verification passed 1,597 site checks plus 42 analytics scenarios and 186 assertions; no deployment, production form submission or live campaign occurred.

## New-printer implementation status — released

- Route: `/services/new-printer-setup-ivanhoe/`; the offer is separate from troubleshooting an existing printer.
- Offer: `$250 fixed incl. GST`, including local call-out and up to 90 minutes onsite for one supported new household printer and one primary supported device.
- Included work covers connection to the existing network, current manufacturer software, a test print or scan where supported and a short handover. Printer purchase, wider Wi-Fi remediation, extra devices, subscriptions, provider-controlled accounts, physical repair, parts and consumables are excluded or separately scoped.
- The compact page uses `new_printer_setup`, the shared contact form, a visible 1200×630 image, sitemap and internal discovery links.

## Password-safety implementation status — owner-approved for release

- Route: `/services/password-manager-setup-ivanhoe/`; Ivanhoe and Eaglemont remain the complete service area.
- Offer: `$390 fixed incl. GST`, including the phone suitability check, local call-out and up to two hours onsite for one person, one personal vault, one primary computer, one phone or tablet and one straightforward supported import.
- The client creates and enters the master password, credentials, authentication codes and recovery material. Naked Tech does not record, photograph, copy, transmit, retain or take custody of them.
- Active compromise routes to Scam & Account Security. Provider-controlled recovery, identity restoration, fund recovery, business vaults, additional people/devices and bespoke KeePass or file-sync arrangements are excluded or separately scoped.
- The public guided-service page uses `password_safety_control` and the shared enquiry form. The separate production suitability form is operator-only, completed by Peter with the client, and has no public respondent route.
- Local verification passes 1,974 site checks plus 56 analytics scenarios and 248 assertions; no public form submission or analytics-platform event was created.

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

```text
2026-07-29 — P5-T1 approved; final image set generated and verified
- Approval: both concepts, revised Concept B commercial copy, new imagery and matched `4:5`/`1:1` system approved
- Files: creative brief/strategy/page/audit plus four WebP exports, two retained sources, provenance record and deterministic composition script
- Creative QA: an independent audit rejected the first Wi-Fi badge/distress treatment; the no-person replacement and `$190 FIXED DIAGNOSIS` revision then passed full-size and feed-size review
- Technical QA: `1080 × 1350`/`1080 × 1080`, `540 px` feed previews, source/output SHA-256 records and FLUX v2.1 output-use basis passed
- Verification: 535 site checks/17 pages, 14 analytics scenarios/62 assertions, production build and fan-out checks passed
- Mutation boundary: no upload, campaign/ad edit, budget change, publication or spend
- Next task: obtain owner visual approval of all four exports before P5-T2
```

```text
2026-07-29 — Revised Wi-Fi exports visually approved
- Source: owner-generated and edited ChatGPT background with embedded C2PA retained in the PNG source
- Creative: inverse logo mark, stronger two-line supporting copy and `$190 FIXED DIAGNOSIS` badge approved in both `4:5` and `1:1`
- Mutation boundary: no Meta upload or campaign/ad change
- Next task: obtain explicit visual approval of the unchanged verified slow-computer pair before P5-T2
```

```text
2026-07-29 — Four-image creative asset gate complete
- Approval: the unchanged slow-computer `4:5` and `1:1` exports are owner-approved; all four final assets are now approved
- Verification: independent audit, full-size review, `540 px` feed review, dedicated-crop checks and deterministic checksum verification passed
- Mutation boundary: no Meta upload, campaign/ad edit, budget change, publication or spend
- Next task: prepare the P5-T2 campaign-structure and budget proposal for explicit owner approval
```

```text
2026-07-29 — P5-T2 campaign structure and budget proposal prepared
- Approval: owner approved the revised sequential pilot; publication, activation and spend remain separately gated
- Recommendation: one new Leads campaign with two identical sequential ad-set budget containers; one approved concept per arm
- Budget/schedule: up to `$40` per arm; equal seven-day windows, 72-hour washout, frequency-`4.0` stop and matched lower spend
- Audience/placement: Ivanhoe + Eaglemont, 35–65+, broad within geography, Facebook Feed only, approved `4:5` assets
- Evidence: current Meta A/B, budget and Feed guidance; preserved campaign CSV; live destination/UTM checks; same-day read-only Meta state
- Mutation boundary: current authenticated Meta state could not be re-read; no draft, upload, setting, publication or spend change occurred
- Next task: authenticated state recheck and unpublished/off draft construction; P5-T3 and launch approval remain separate
```

```text
2026-07-30 — P5-T2 unpublished/off draft assembly complete
- Live state: new campaign, both `$45` lifetime ad sets and both ads are Off/In draft with blank delivery, results and spend; old generic campaign remains Off
- Creative: exact approved copy/CTA, four native ratios, zero AI media, text optimisation Disabled, six standard enhancements Off and three Essential enhancements Off
- Safety: five draft objects remain unpublished; no activation, delivery submission or spend authorisation occurred
- Private raw evidence: `docs/marketing/evidence/meta-test-01/p5-t2/78-*.png` through `83-*.png` plus the retained earlier Arm B evidence; excluded from public Git, with the evidence policy documented in the public manifest
- Blocker: Arm A excludes rewarded video + Threads; Arm B excludes rewarded video only; Instagram Feed error cleared
- Next task: P5-T3 placement-parity decision and full pre-launch checks; explicit launch approval remains mandatory
```

```text
2026-07-30 — P5-T3 technical pre-launch audit complete
- Corrections: Arm A Threads set to the same `Use Facebook Page` value as Arm B; both weekday grids corrected from `09:00–18:00` to `[09:00,17:00)`
- Placement parity: both ads now have only Audience Network rewarded videos unavailable because the approved media is static
- Technical checks: exact destinations/UTMs, true-mobile rendering, visible Meta previews, conversion controls, analytics/form-message behavior, `$45` lifetime budgets, Ivanhoe/Eaglemont geography and persisted schedule grids passed
- Safety: campaign, both ad sets and both ads remain Off/In draft with blank delivery/results/spend; `Review and publish (5)` remains untouched
- Evidence: public audit at `docs/marketing/meta-test-01-p5-t3-pre-launch-audit.md`; private raw captures under `docs/marketing/evidence/meta-test-01/p5-t3/`, excluded from public Git and represented by hashes in the public manifest
- Next task: obtain a fresh explicit launch decision; do not treat the correction approval as publication or spend authorisation
```

```text
2026-07-30 — Separate launch approval and publication complete
- Schedule: Arm A extended to Thursday 6 August 2026 at 17:00 AEST; Arm B retained 10–14 August, weekdays `[09:00,17:00)`
- Review: five objects — one campaign, two ad sets and two ads — presented with no reported errors
- Publication: all five objects published; the campaign and both ads were switched on
- Readback: Slow Computer active, Wi-Fi scheduled, both lifetime budgets `$45`, and `$0.00` spent at the retained checkpoint
- Evidence policy: raw Ads Manager screenshots remain private because they expose account UI/profile identifiers; public Git retains descriptions and SHA-256 hashes
- Next task: preserve controls, check technical health only, and wait for both arms plus the attribution-settling window before Phase 6
```
