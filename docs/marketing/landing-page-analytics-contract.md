# Naked Tech Landing-Page Analytics Contract

**Status:** Phase 0 baseline contract<br>
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

## Current implementation after P1-T3

- `src/_includes/layouts/base.njk` emits the global Meta `PageView`, loads GA4, and owns the single delegated `tel:` handler for Meta `Contact` plus GA4 `phone_click`.
- `src/_includes/components/contact-form.njk` owns the iframe, trusted resize handling, and deduplicated Meta `Lead` plus GA4 `generate_lead` events.
- `src/contact.njk` imports that shared component and contains no page-local message, submission, or telephone handler.
- Pain pages expose `landing.id` on the base-layout body; the shared form also accepts explicit `painPoint` context. The generic contact page intentionally sends only `page_path`.

## P1-T3 Sanctum Forms capability finding

The public `nakedtech-contact` form output was inspected on 28 July 2026. Its parent integration currently emits only `sanctum-forms:resize` and `sanctum-forms:submitted`. It exposes no supported query/default/hidden-field mapping for `pain_point`, UTMs, or landing-page path, and it emits no trusted first-interaction message.

Therefore:

- page and pain context stay in parent-page analytics for now; the component does not claim that the form submission record stores them;
- `form_start` remains deferred until Sanctum Forms emits a documented trusted interaction message or the form schema/integration is intentionally revised in P4-T2;
- the parent accepts the two supported messages only from the exact Forms origin and matching iframe window.

## Verification evidence required before launch

- A pain-page load emits one `view_service` and one `ViewContent` with the expected identifier.
- One telephone-link activation emits one `phone_click` and one `Contact` and is reported as a micro-conversion.
- First form interaction emits one `form_start` and no Meta lead event.
- One successful test submission emits one `generate_lead` and one `Lead`.
- Replayed or wrong-origin messages emit no analytics events and do not resize the iframe.
- Browser-console, GA4 DebugView, and Meta Events Manager evidence agree on event names and pain context.
