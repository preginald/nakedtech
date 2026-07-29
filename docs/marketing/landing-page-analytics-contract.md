# Naked Tech Landing-Page Analytics Contract

**Status:** Phase 4 / P4-T2a production owner-notification repair verified; P4-T3 platform evidence pending<br>
**Applies to:** pain-point landing pages, shared telephone tracking, and the shared Sanctum Forms integration<br>
**Canonical plan:** `.hermes/plans/2026-07-28_123314-naked-tech-pain-point-landing-pages.md`

## Principles

- Record a visitor action once and describe it honestly.
- A page view, telephone-link click, or form start is a **micro-conversion**, not a lead.
- Only a successfully submitted enquiry is a **macro-conversion**.
- A telephone-link click does not prove that a call connected or became a qualified job.
- Meta and GA4 must receive the same `pain_point` and page context for the same action where the platform supports those parameters.
- Missing campaign parameters remain missing; tracking code must not invent attribution values.

## Event vocabulary

| User action | Classification | GA4 event | Meta event | Required parameters | Firing rule |
|---|---|---|---|---|---|
| Pain page rendered | Micro-conversion | `view_service` | `ViewContent` | `pain_point`, `page_path`, `campaign_content` | Once per pain-page load |
| `tel:` link activated | Micro-conversion | `phone_click` | `Contact` | `pain_point`, `page_path` | Once per activation; not a completed-call event |
| First meaningful form interaction | Micro-conversion | `form_start` | None initially | `pain_point`, `page_path` | Once per page load, on the first field interaction reported by the form integration |
| Form successfully submitted | **Macro-conversion** | `generate_lead` | `Lead` | `pain_point`, `page_path` | Once after a trusted successful-submission message |

`campaign_content` is the value of `utm_content` when present. For non-campaign visits it is omitted rather than populated with a guessed label.

## Pain-point identifiers

Use stable snake-case identifiers. Copy and route changes must not create new identifiers for the same buying problem.

- `wifi_dropouts`
- `slow_computer`
- `scam_security` (reserved for a later approved page)

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
- The form component allowlists only `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` when sending context to the Forms iframe. The target origin is exact; arbitrary query keys are excluded.
- `src/contact.njk` imports the shared component and contains no page-local message, submission, or telephone handler.
- Pain pages expose `landing.id` on the base-layout body; the shared form also accepts explicit `painPoint` context. The generic contact page intentionally sends only `page_path` unless supported campaign context is present.

## Sanctum Forms capability boundary

The public `nakedtech-contact` form output inspected during P1-T3 on 28 July 2026 exposed only resize and submitted messages, with no supported context-field mapping or trusted first-interaction message. That is a historical baseline, not proof of the current provider deployment.

The website parent now implements protocol-v1 `ready`, `context`, and `started` handling. P4-T1 proved that parent-side behaviour using deterministic trusted-message probes. P4-T2 then verified that the production Forms provider is deployed at commit `5ca4b19`, renders the matching protocol-v1 child, and persists accepted context separately from answers under migration `0020`.

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

### Evidence limits and next gates

- A no-UTM visit covers the custom-event behaviour shared by direct and organic traffic. GA4 determines acquisition source from its own collection context and referrer; this script does not fabricate that classification.
- Form start and submission were exercised with synthetic protocol messages from the trusted origin/window. No real form was submitted and no production record was created.
- The P4-T1 context handshake proves what the parent sends; the separate P4-T2 evidence below establishes current provider receipt, storage and operator exposure.
- P4-T3 must collect end-to-end GA4 DebugView and Meta Events Manager evidence after the final routes are approved for deployment.

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
- Keep one shared `nakedtech-contact` form for both pain pages; do not clone schemas merely to distinguish acquisition context.
- Continue preserving all four approved UTMs in browser analytics independently of form persistence.
- Send context exactly once after trusted `ready`; the provider's first-valid-context rule prevents later mutation.
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

## Verification evidence required before launch

- A pain-page load emits one `view_service` and one `ViewContent` with the expected identifier.
- One telephone-link activation emits one `phone_click` and one `Contact` and is reported as a micro-conversion.
- First form interaction emits one `form_start` and no Meta lead event.
- One successful test submission emits one `generate_lead` and one `Lead`.
- Replayed or wrong-origin messages emit no analytics events and do not resize the iframe.
- Browser-console, GA4 DebugView, and Meta Events Manager evidence agree on event names and pain context.
