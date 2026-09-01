# Naked Tech Landing-Page Analytics Contract

**Status:** Phase 4 evidence retained; #4213 privacy-aware correlation extension implemented and awaiting controlled production proof<br>
**Applies to:** pain-point landing pages, shared telephone tracking, and the shared Sanctum Forms integration<br>
**Canonical plan:** `.hermes/plans/2026-07-28_123314-naked-tech-pain-point-landing-pages.md`

## Principles

- Record a visitor action once and describe it honestly.
- A page view, telephone-link click, or form start is a **micro-conversion**, not a lead.
- Only a successfully submitted enquiry is a **macro-conversion**.
- A telephone-link click does not prove that a call connected or became a qualified job.
- Meta and GA4 must receive the same `pain_point` and page context for the same action where the platform supports those parameters.
- Missing campaign parameters remain missing; tracking code must not invent attribution values.
- Operational lead correlation remains first-party and is never sent to GA4 or Meta.
- Campaign, referrer and advertising click values require the matching current consent category before they enter Forms context.

## Event vocabulary

| User action | Classification | GA4 event | Meta event | Required parameters | Firing rule |
|---|---|---|---|---|---|
| Pain page rendered | Micro-conversion | `view_service` | `ViewContent` | `pain_point`, `page_path`, `campaign_content` | Once per pain-page load |
| `tel:` link activated | Micro-conversion | `phone_click` | `Contact` | `pain_point`, `page_path` | Once per activation; not a completed-call event |
| First meaningful form interaction | Micro-conversion | `form_start` | None initially | `pain_point`, `page_path` | Once per page load, on the first field interaction reported by the form integration |
| Form successfully submitted | **Macro-conversion** | `generate_lead` | `Lead` | `pain_point`, `page_path` | Once after a trusted successful-submission message |
| Published service selected from site search | Micro-conversion | `site_search_service_select` | None | reviewed intent/service category, `result_state`, `search_source`, `page_path`, internal `destination_path` | Once per service destination activation and only when Analytics is already enabled; never includes typed query text |

`campaign_content` is the value of `utm_content` when present. For non-campaign visits it is omitted rather than populated with a guessed label.

## Pain-point identifiers

Use stable snake-case identifiers. Copy and route changes must not create new identifiers for the same buying problem.

- `wifi_dropouts`
- `slow_computer`
- `scam_security`
- `virus_malware`
- `new_computer_setup`
- `printer_help`
- `email_help`
- `new_printer_setup`
- `backup_setup`
- `mobile_setup`
- `password_safety_control`

The generic contact page has no pain-point identifier unless it receives verified context from a pain page. Do not label all generic enquiries as one of the identifiers above.

## Campaign parameters

Supported inbound keys:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`

Paid Meta URLs must use unique `utm_content` values per approved concept or creative. The initial planned values are `wifi_dropouts_v1` and `slow_computer_v1`. Preserve the original landing attribution across the same-site enquiry journey where technically possible; document any Sanctum Forms limitation rather than fabricating stored form attribution.

## Required context

- `pain_point`: stable identifier from the page data contract.
- `page_path`: browser pathname for the page where the action occurred, beginning with `/`.
- `campaign_content`: inbound `utm_content`, only when present.

Additional UTM keys may be sent to GA4, but they do not replace the required event context.

## Ownership and deduplication

- The shared landing-page layout will own `view_service` / `ViewContent` for pain pages.
- One sitewide or shared-template delegated handler will own `phone_click` / `Contact` for `tel:` links.
- The shared contact-form component owns iframe resize handling plus `generate_lead` and `Lead`; it will also own `form_start` when the provider exposes a documented trusted interaction message.
- Do not add page-local copies of these handlers.
- When the shared form component is introduced, remove the existing handlers in `src/contact.njk`; they must not remain active alongside the replacement.
- Guard form-start and submission events so one interaction or submission cannot emit duplicates if a message is repeated.

## Sanctum Forms message trust boundary

Before processing **any** resize, engagement, or submission message:

1. Require `event.origin === 'https://forms.digitalsanctum.com.au'`.
2. Require a plain object with an expected `type` value.
3. Where the iframe element is available, require `event.source === iframe.contentWindow`.
4. Validate event-specific data before use, including a finite positive resize height.

Only `sanctum-forms:submitted` from that trusted source may emit `generate_lead` and `Lead`. A resize message must never count as engagement or conversion.

## Current website implementation entering Phase 4

- `src/_includes/layouts/base.njk` emits the global Meta `PageView`, loads GA4, and owns the single delegated `tel:` handler for Meta `Contact` plus GA4 `phone_click`.
- `src/_includes/layouts/sales-landing-page.njk` owns `ViewContent` and `view_service`, mapping a non-empty inbound `utm_content` to `campaign_content` and omitting the parameter when no value exists.
- `src/_includes/components/contact-form.njk` owns the protocol-v1 ready/context handshake, trusted resize and start handling, and deduplicated Meta `Lead` plus GA4 `form_start` / `generate_lead` events.
- The lead-journey bootstrap sends the privacy-aware schema described below. The target origin is exact; arbitrary query keys are excluded.
- `src/contact.njk` imports the shared component and contains no page-local message, submission, or telephone handler.
- Pain pages expose `landing.id` on the base-layout body; the shared form also accepts explicit `painPoint` context. The generic contact page intentionally sends only `page_path` unless supported campaign context is present.
- The shared site-search controller emits GA4-only `site_search_service_select` for a published service. It requires an active Analytics opt-in, is not queued for later consent and sends only bounded identifiers and paths; the query remains in the browser.

## Sanctum Forms capability boundary

The public `nakedtech-contact` form output inspected during P1-T3 on 28 July 2026 exposed only resize and submitted messages, with no supported context-field mapping or trusted first-interaction message. That is a historical baseline, not proof of the current provider deployment.

The website parent now implements protocol-v1 `ready`, `context`, and `started` handling. P4-T1 proved that parent-side behaviour using deterministic trusted-message probes. P4-T2 then verified that the production Forms provider is deployed at commit `5ca4b19`, renders the matching protocol-v1 child, and persists accepted context separately from answers under migration `0020`.

## #4213 privacy-aware lead correlation extension

Message protocol v1 remains unchanged, while the context carried inside it now declares `schema_version: 2`. The parent creates a cryptographically random tab-scoped `correlation_id` and retains only bounded operational landing context and signal presence before consent. It does not place raw referrer, UTM or click-ID values into the session record until the corresponding current choice permits them.

| Evidence | Collection rule | Destination |
| --- | --- | --- |
| Correlation ID, query-free landing URL/path, form page, service category, timestamps and explicit signal states | Necessary to receive and trace the requested service enquiry | Forms, owner Notify path and the future Core lead contract; never GA4 or Meta |
| External referrer plus four approved UTM values | Analytics currently granted | Forms context; ordinary consented website analytics retain their existing provider contract |
| `gclid`, `gbraid`, `wbraid`, `fbclid` | Advertising currently granted | Forms context; never attached when Advertising is denied or unavailable |
| Server-issued `lead_event_id` | Accepted Forms submission only | Meta `eventID` for deduplication; GA4 custom parameter for correlation only |

The child accepts a consent update only for the same immutable journey. Forms canonicalises the browser declaration, strips URL query/fragment data, applies a 4 KiB durable bound, adds server-clock and completeness evidence, and returns completion IDs only for an accepted persisted submission. The parent rechecks current consent at event time: `form_start` and `generate_lead` require Analytics, and Meta `Lead` requires Advertising. It never sends answers, contact fields, raw network addresses or the first-party correlation ID to either analytics provider.

The deterministic matrix covers granted, denied and unavailable consent, absence of campaign values, stable same-journey enrichment, hostname-prefix referrer defence, server completion IDs and trusted-message replay. The current local run passed 4,045 generated-site checks plus 80 analytics scenarios and 393 assertions. Synthetic local calls remain implementation evidence rather than proof of provider receipt. Production proof requires one separately approved, clearly labelled non-sensitive canary after Notify, Forms and Naked Tech are deployed in that order.

Forensics must preserve source limits: GA4 does not expose raw visitor IP addresses or promise `generate_lead` deduplication from this custom parameter; Search Console is aggregated search-demand evidence; the browser context is declarative rather than proof of click authenticity. Tickets #4192, #4193, #4194 and #4215 own provider, edge, correlation-bundle and search-evidence adapters. Ticket #4214 owns creation and lifecycle of the Core lead from this stable contract.

## P4-T1 UTM and event verification matrix

**Executor:** `scripts/analytics-matrix.mjs`<br>
**Command:** `npm run build && npm run audit:analytics`<br>
**Observed result:** 14 scenarios and 62 assertions passed against clean generated output.

The executor runs the exact inline scripts from the generated landing pages and replaces GA4/Meta network calls with local collectors. “Observed” below therefore means the browser-side parent script emitted the stated call locally; it does not mean GA4 DebugView or Meta Events Manager received it.

| Scenario | Expected GA4 | Observed GA4 | Expected Meta | Observed Meta | Exact event context | Classification |
|---|---|---|---|---|---|---|
| Paid Wi-Fi page view | `view_service` ×1 | `view_service` ×1 | `ViewContent` ×1 | `ViewContent` ×1 | `pain_point: wifi_dropouts`; `page_path: /services/wifi-dropouts-ivanhoe/`; `campaign_content: wifi_dropouts_v1` | Micro |
| Paid slow-computer page view | `view_service` ×1 | `view_service` ×1 | `ViewContent` ×1 | `ViewContent` ×1 | `pain_point: slow_computer`; `page_path: /services/slow-computer-help-ivanhoe/`; `campaign_content: slow_computer_v1` | Micro |
| Wi-Fi direct/organic visit without UTMs | `view_service` ×1 | `view_service` ×1 | `ViewContent` ×1 | `ViewContent` ×1 | `pain_point: wifi_dropouts`; `page_path: /services/wifi-dropouts-ivanhoe/`; `campaign_content` omitted | Micro |
| Slow-computer direct/organic visit without UTMs | `view_service` ×1 | `view_service` ×1 | `ViewContent` ×1 | `ViewContent` ×1 | `pain_point: slow_computer`; `page_path: /services/slow-computer-help-ivanhoe/`; `campaign_content` omitted | Micro |
| Wi-Fi telephone-link activation | `phone_click` ×1 | `phone_click` ×1 | `Contact` ×1 | `Contact` ×1 | `pain_point: wifi_dropouts`; `page_path: /services/wifi-dropouts-ivanhoe/` | Micro; not a completed call |
| Slow-computer telephone-link activation | `phone_click` ×1 | `phone_click` ×1 | `Contact` ×1 | `Contact` ×1 | `pain_point: slow_computer`; `page_path: /services/slow-computer-help-ivanhoe/` | Micro; not a completed call |
| Wi-Fi first meaningful form interaction | `form_start` ×1 | `form_start` ×1 | None | None ×0 | `pain_point: wifi_dropouts`; `page_path: /services/wifi-dropouts-ivanhoe/` | Micro |
| Slow-computer first meaningful form interaction | `form_start` ×1 | `form_start` ×1 | None | None ×0 | `pain_point: slow_computer`; `page_path: /services/slow-computer-help-ivanhoe/` | Micro |
| Wi-Fi successful form submission | `generate_lead` ×1 | `generate_lead` ×1 | `Lead` ×1 | `Lead` ×1 | `pain_point: wifi_dropouts`; `page_path: /services/wifi-dropouts-ivanhoe/` | **Macro** |
| Slow-computer successful form submission | `generate_lead` ×1 | `generate_lead` ×1 | `Lead` ×1 | `Lead` ×1 | `pain_point: slow_computer`; `page_path: /services/slow-computer-help-ivanhoe/` | **Macro** |

### Forms context and negative controls

| Probe | Expected | Observed locally |
|---|---|---|
| Paid Wi-Fi protocol-v1 handshake | One context message to the exact Forms origin with `pain_point`, `page_path`, and the four allowlisted UTMs | Exactly one; values matched the paid Wi-Fi URL; `utm_term` and an arbitrary `unknown` key were omitted |
| Paid slow-computer protocol-v1 handshake | One context message to the exact Forms origin with `pain_point`, `page_path`, and the four allowlisted UTMs | Exactly one; values matched the paid slow-computer URL; `utm_term` and an arbitrary `unknown` key were omitted |
| Replayed trusted `ready`, `started`, and `submitted` messages | No duplicate context, `form_start`, `generate_lead`, or `Lead` | Counts remained exactly one for both pages |
| Wrong-origin and wrong-source messages | No context, analytics event, or resize side effect | Rejected for both pages; no additional analytics calls; trusted 720px height remained unchanged |
| Invalid resize payload | No resize or analytics side effect | Rejected for both pages |

### P4-T1 evidence limits

- A no-UTM visit covers the custom-event behaviour shared by direct and organic traffic. GA4 determines acquisition source from its own collection context and referrer; this script does not fabricate that classification.
- Form start and submission were exercised with synthetic protocol messages from the trusted origin/window. No real form was submitted and no production record was created.
- The P4-T1 context handshake proves what the parent sends; the separate P4-T2 evidence below establishes current provider receipt, storage and operator exposure.
- P4-T3 platform evidence collected after deployment is recorded below.

### Local contract extension — 1 August 2026

The deterministic matrix now covers eight service contexts and passes 56 scenarios with 248 assertions. New Computer Setup, printer help, email help, new-printer setup and password safety/control use synthetic `site_audit / test / non_live_validation` attribution solely to exercise attributed code paths; this is not evidence of a live paid campaign, production analytics receipt or a form submission. The historical P4-T1 and P4-T3 evidence remains unchanged.

## P4-T2 Sanctum Forms provider capability verification

**Provider source/deployment:** Sanctum Forms commit `5ca4b19` (`feat(forms): add secure iframe attribution protocol`)<br>
**Production state:** service `active`; Alembic `0020 (head)`<br>
**Automated verification:** 73 targeted backend tests plus one frontend attribution-detail test passed.

| Capability | Expected | Observed evidence |
|---|---|---|
| Live protocol-v1 child | Exact-origin `ready`, `context`, `started`, `resize`, `submitted`; no answer data or wildcard target | Live `nakedtech-contact` renderer contained all five message types, `_sf_context`, exact approved origins and no wildcard `postMessage` target |
| Parent/child handshake | Existing shared form loads and accepts trusted resize without a new submission | Production `/contact/` iframe changed from its 650px fallback to an inline/client height of 858px; the page contained the matching five-message parent contract |
| Context validation | Keep only `pain_point`, `page_path`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`; reject unknown/unsafe values | Client and server implementations enforce the same allowlist, per-field limits and 2,048-byte cap; `page_path` rejects URLs, query strings and fragments |
| Separate persistence | `_sf_context` never enters respondent answers | Production schema exposes non-null JSONB `submissions.context`; public submission handling removes `_sf_context` before answer validation and persists its sanitised value separately |
| Existing production proof | At least one retained submission identifies its originating context without creating test data in this session | 2 of 28 production submissions had non-empty context, both for `nakedtech-contact`: one `/contact/` path record and one retained protocol release-verification record with page, pain and UTM metadata |
| Operator exposure | Problem context remains visible separately from answers | Authenticated response schema/UI, admin HTML, JSON/CSV exports and MCP export expose dedicated attribution fields; public/share views do not |
| Notification boundary | Owner notification data may carry attribution, respondent receipts must not | Forms code/tests put `context` only in owner notification `data`, but delivery is currently broken: the two corresponding Notify rows are `dead_letter` because configured template `general-contact-notification` is absent |
| One-form architecture | No duplicate forms or tracking fields required | The existing `nakedtech-contact` form carries page/pain/UTM context through the reserved protocol transport and dedicated JSONB column |

### P4-T2 decision

- Do not add a visible or hidden/default `pain_point` field. The provider's official reserved context transport is the safer, already deployed capability.
- Keep one shared public `nakedtech-contact` form across the Wi-Fi, slow-computer, scam/security, New Computer Setup, printer-help and email-help pages. Page and service context distinguish enquiries without multiplying public forms.
- The detailed `nakedtech-new-computer-move-suitability` form is an unlinked, owner-operated checklist that Peter completes with the customer during a guided conversation. Its hosted URL remains public rather than access-controlled, so it must never collect passwords, authentication codes, recovery keys, licence keys or sensitive documents.
- Continue preserving all four approved UTMs in browser analytics independently of form persistence.
- Send initial context exactly once after trusted `ready`; #4213 supersedes the historical immutability rule only for a same-journey consent update.
- No new production form was submitted during P4-T2. Existing retained records and read-only production inspection supplied the persistence evidence.

### Owner notification defect discovered during P4-T2

Sanctum Forms and Sanctum Notify have different status boundaries. Forms sets its row to `sent` when Notify accepts the request, but Notify returns HTTP 202 before its asynchronous renderer and email provider run. For both retained context-bearing Naked Tech submissions, cross-service lookup found:

| Forms submission | Forms status | Notify template | Actual Notify status | Error |
|---|---|---|---|---|
| `d9aa32fb-2c0b-4f11-ba7f-593ad0c681f4` | `sent` | `general-contact-notification` | `dead_letter` | `Template not found: general-contact-notification` |
| `9ef9b8d9-51c2-4381-832e-4199bf2cbedd` | `sent` | `general-contact-notification` | `dead_letter` | `Template not found: general-contact-notification` |

Production configuration confirms `nakedtech-contact` uses `general-contact-notification`, while the tracked production Notify checkout at commit `d9c3fd5` contains no template with that slug. Its deployed generic `form-submission.html` iterates respondent `payload` only and does not render the separate `context` object. Consequently:

- the provider **does** persist page, pain and UTM context and exposes it to authenticated operators;
- the owner notification envelope **does** contain context before queuing;
- no owner email was delivered for the two retained verification submissions;
- Forms `notify_status: sent` is queue-acceptance evidence, not final delivery evidence; and
- P4-T2a must deploy the locally verified official-template enhancement, deliberately migrate the form away from the stale slug, then prove final Notify status `sent` with one approved labelled submission before P4-T3.

### P4-T2a remediation and production proof

The stale `general-contact-notification` slug is absent from Sanctum Forms and Sanctum Notify source and Git history, and it is not in Forms' official `NOTIFY_TEMPLATE_SLUGS` catalogue. It is therefore treated as invalid production configuration rather than a missing template contract to preserve.

The durable implementation was built and verified in `/home/preginald/Dev/sanctum-notify`:

- the official `form-submission.html` owner template now renders a separate optional Attribution table;
- the table assigns operator-readable labels to pain, page and all four UTM keys;
- absent or empty context produces no empty section;
- attribution keys and values remain Jinja-autoescaped;
- respondent receipts remain unchanged and continue to omit context;
- 13 focused template tests passed;
- the full Notify suite passed 269 tests with 3 skipped, and repository-wide Ruff lint/format checks passed; and
- a rendered Naked Tech preview showed readable, separated submission/attribution tables with zero horizontal overflow and no raw template syntax.

After explicit approval, Notify commit `06d8470` was pushed and deployed. The service restarted active, `/health` reported healthy database and dispatcher dependencies, and a production-side render probe proved `form-submission` emitted the Attribution section with every supplied context value.

The Forms migration used its own versioned frontend path rather than a direct database edit:

1. `PATCH /api/v1/templates/{id}` created `Naked Tech Contact` v2 with `notify_template_id: form-submission`.
2. `POST /api/v1/templates/{template_id}/upgrade/{instance_id}` explicitly upgraded the pinned live instance from v1 to v2.
3. A read-back verified active status, the unchanged endpoint, four original field names, one owner recipient, and all three allowed origins.
4. The public renderer remained HTTP 200 with the protocol-v1 marker and original submission endpoint.

One labelled production submission then supplied `wifi_dropouts`, the Wi-Fi landing path and all four verification UTMs. Forms created submission `6b70ef82-9b48-418a-8718-697cc4a62960` with the context in its separate JSONB column. Notify created row `7c9bd7f7-6fb0-42b7-af20-7d24ce983014` using `form-submission`; the notification retained the same context and reached final status `sent` with an empty error field. This proves final delivery state rather than Forms' intermediate HTTP-202 queue acceptance. Historical dead-letter rows were retained and no production data was deleted.

## P4-T3 production platform verification

**Website release:** Naked Tech commit `dc6f93e` (`feat(marketing): launch pain-point landing pages`)<br>
**Deployment:** GitHub Actions run `30418774880`, completed successfully for exact head `dc6f93e9f2218e188a096362d5d4ceaff26d5840`<br>
**Controlled browser window:** 29 July 2026, 14:01:36–14:02:21 AEST<br>
**GA4 property:** Digital Sanctum → Naked Tech Website, property `547079333`<br>
**Meta dataset:** Naked Tech Website, Pixel `1010322558552545`; Test Events code `TEST99475`

The retained production journey loaded each canonical pain page once with the approved paid-social campaign parameters. On the Wi-Fi page it activated one telephone link without opening a dialler, performed one first form interaction, and submitted one clearly labelled enquiry. After successful submission, trusted replays plus malformed, wrong-origin and wrong-source message controls were dispatched. The browser then loaded the slow-computer page once without starting or submitting its form.

### GA4 DebugView evidence

| Event | Expected | DebugView observed | Context evidence |
|---|---:|---:|---|
| `view_service` | 2 | 2 | Slow-computer event showed `slow_computer`, `/services/slow-computer-help-ivanhoe/`, `slow_computer_v1`, source `facebook`, medium `paid_social`, campaign `naked_tech_pain_points_01`; the instrumented Wi-Fi request carried the matching Wi-Fi values |
| `phone_click` | 1 | 1 | Wi-Fi event carried `wifi_dropouts` and `/services/wifi-dropouts-ivanhoe/` |
| `form_start` | 1 | 1 | First meaningful Wi-Fi form interaction only |
| `generate_lead` | 1 | 1 | DebugView detail showed `wifi_dropouts` and `/services/wifi-dropouts-ivanhoe/` |

DebugView also showed two ordinary `page_view` events, one per canonical page. These are baseline collection events rather than additional lead conversions.

### Meta Events Manager evidence

All contractual browser events were marked **Processed** in Test Events using manual Pixel setup:

| Event | Expected | Events Manager observed | Platform detail |
|---|---:|---:|---|
| `ViewContent` | 2 | 2 | Wi-Fi event `ob3_plugin-set_7b369affe5731f4f748c8e010af708cf647a5e1c506fbe945cc4e1c03a9254bd` carried `wifi_dropouts`, the canonical Wi-Fi path and `wifi_dropouts_v1`; slow-computer event `ob3_plugin-set_995853b79b587a3c3368ffc816d5dd8590fffa81ea13bddfc5fae4246bb042c7` carried the corresponding slow-computer values |
| `Contact` | 1 | 1 | Event `ob3_plugin-set_ff7af5231009430561e182508e667257900c75da7f4e15aed35e44f8d41e3704` |
| `Lead` | 1 | 1 | Event `ob3_plugin-set_848d967433ed0c986a95b4fa4bf9d20689f0e50e649ef05fc623aa913cf832e0` |

Meta also emitted one automatically logged `SubscribedButtonClick`. It is not owned by the contractual website implementation and is not counted as a telephone, form-start or lead conversion.

### Retained Forms and final Notify evidence

The approved marker was absent before the test and produced exactly one retained Forms row:

- Forms submission `9cde7885-97ed-4fed-bba0-185e7261a209` at `2026-07-29 04:01:58.449609+00`;
- `notify_status: sent` with dispatch timestamp `2026-07-29 04:01:58.507443+00`;
- separate context contained `wifi_dropouts`, `/services/wifi-dropouts-ivanhoe/`, `facebook`, `paid_social`, `naked_tech_pain_points_01`, and `wifi_dropouts_v1`;
- downstream Notify row `ec7dfd6e-42ba-45bd-87c2-e054b20884ad` used `form-submission`, retained the identical context, reached final `sent`, and had no error.

The successful form renderer response was observed in-browser. Replayed trusted lifecycle messages and malformed, wrong-origin and wrong-source controls produced no additional contractual events. The two-page run produced no browser console errors or page exceptions.

**P4-T3 result:** passed. Phase 4 exit evidence is complete; tracking distinguishes pain-page views, telephone micro-conversions, form starts and submitted leads with page-level pain and campaign context.
