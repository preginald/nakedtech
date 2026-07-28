# Landing-Page Content Schema

**Status:** Phase 1 page-data contract<br>
**Applies to:** Naked Tech pain-point landing pages rendered by `layouts/sales-landing-page.njk`<br>
**Canonical plan:** `.hermes/plans/2026-07-28_123314-naked-tech-pain-point-landing-pages.md`<br>
**Approved strategy:** `docs/marketing/2026-07-28-facebook-campaign-and-landing-page-strategy.md`

## Purpose

This contract lets an agent author one thin landing-page file without opening or copying another landing page. Page files provide structured, problem-specific content. The shared layout owns markup, section order, accessibility, CTA placement, trust treatment, structured-data rendering and analytics behaviour.

A page that has the right field shape is not automatically publishable. Commercial claims, prices, exclusions, service areas and proof must still have owner-approved sources.

## Authoring rules

1. Put page data in YAML front matter and leave the Nunjucks body empty.
2. Set `layout` to the fixed shared layout. Do not copy section markup into a page file.
3. Treat every field marked **Required** as present and non-empty. Omit an optional field when it has no approved value; do not use an empty string, empty object or public `TBC` placeholder.
4. Use plain text in content fields. Do not put HTML, Nunjucks expressions or Markdown links in page data.
5. Quote YAML values that contain `#`, `:`, currency symbols or other syntax-sensitive punctuation.
6. Keep all problem claims specific to the page's `landing.id`. Do not broaden a pain-specific page into a catalogue of unrelated services.
7. Array order is display order. The shared layout derives process step numbers from array order.

## Top-level contract

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `layout` | string | **Required** | Must equal `layouts/sales-landing-page.njk`. |
| `title` | string | **Required** | Unique SEO title across landing pages. Do not include the site-name suffix; the base layout owns it. |
| `description` | string | **Required** | Unique plain-text meta description of at least 50 characters. It must describe this page's problem and offer honestly. |
| `permalink` | string | **Required** | Unique absolute output path in the form `/problem-route/index.html`. This is the canonical-route source; do not add a second page-level canonical field. |
| `ogImage` | string | **Required** | Root-relative path to an approved image. It should be problem-specific. A named implementation task may expressly permit the approved site default, but the field must still be present. |
| `ogImageWidth` | positive integer | Optional | Actual source-image width in pixels. If supplied, `ogImageHeight` is also required. The base-layout default applies when the pair is omitted. |
| `ogImageHeight` | positive integer | Optional | Actual source-image height in pixels. If supplied, `ogImageWidth` is also required. The base-layout default applies when the pair is omitted. |
| `landing` | object | **Required** | All sales-page content and page identifiers described below. |

The canonical URL is derived from `permalink`. The public H1 is derived from `landing.headline`. Do not add competing `canonical` or `h1` fields.

## `landing` contract

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `id` | snake-case string | **Required** | Stable pain identifier used by analytics and form context. Approved initial identifiers are `wifi_dropouts` and `slow_computer`; a later security page uses `scam_security`. |
| `eyebrow` | string | **Required** | Short local-relevance line above the H1. Geography must match approved service scope. |
| `headline` | string | **Required** | The page's only H1. State the exact customer pain and desired outcome in customer language. It must be unique across landing pages. |
| `promise` | string | **Required** | One plain-English paragraph continuing the advertisement/search promise and explaining the diagnostic-first outcome. |
| `offer` | object | **Required** | Approved entry offer and its explicit scope/exclusions. |
| `cta` | object | **Required** | Primary on-page progression and immediate telephone option. |
| `symptoms` | array of symptom objects | **Required** | Exactly 3 recognisable symptoms. |
| `diagnosis` | object | **Required** | What is assessed and why diagnosis precedes a recommendation or hardware sale. |
| `inclusions` | array of inclusion objects | **Required** | One or more approved deliverables. No hard maximum is imposed by P1-T1; keep the list concise. |
| `process` | array of process-step objects | **Required** | Exactly 3 ordered steps. |
| `proofPoints` | array of proof-point objects | **Required** | Exactly 3 truthful, source-backed trust points. |
| `faqs` | array of FAQ objects | **Required** | Between 3 and 6 problem-specific questions. |
| `form` | object | **Required** | Shared form heading and stable pain context. |
| `schema` | object | **Required** | Approved Service structured-data inputs. |

### `landing.offer`

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `label` | string | **Required** | Short label for the approved starting offer. Do not imply a fixed-price resolution when only diagnosis or first-hour work is approved. |
| `price` | string | **Required** | Owner-approved display text, including qualifiers such as `from` or `including the first hour` where applicable. If no price is approved, page authoring is blocked; do not invent one. |
| `note` | string | **Required** | Explicit scope and exclusions, including dependencies on third parties, hardware, follow-up work or geography where relevant. Silence is not an exclusion statement. |

### `landing.cta`

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `primaryLabel` | string | **Required** | Problem-specific action label that moves the visitor to the enquiry form. |
| `primaryHref` | string | **Required** | Must equal `'#contact'` for the shared on-page form path. |
| `phoneLabel` | string | **Required** | Problem-specific accessible label for the telephone CTA. The shared layout obtains the telephone number and `tel:` URL from site data; page files must not duplicate them. |

### `landing.symptoms[]`

Each symptom object has:

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `title` | string | **Required** | Short symptom phrased in recognisable customer language. |
| `description` | string | **Required** | One concise explanation. Do not state an unverified diagnosis as fact. |

Count: **minimum 3, maximum 3**.

### `landing.diagnosis`

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `heading` | string | **Required** | Problem-specific section heading. |
| `summary` | string | **Required** | Plain-English explanation of the diagnostic approach and why it precedes a recommendation. |
| `checks` | array of diagnosis-check objects | **Required** | One or more relevant checks. No P1-T1 maximum is imposed; include only checks the service genuinely performs. |

Each `checks[]` object has required `title` and `description` strings. A check describes an assessment, not a guaranteed finding or result.

### `landing.inclusions[]`

Each inclusion object has:

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `title` | string | **Required** | Short deliverable label. |
| `description` | string | **Required** | Approved scope detail, including limits where needed. |

The array must be non-empty. Do not use inclusions to contradict `offer.note`.

### `landing.process[]`

Each process-step object has:

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `title` | string | **Required** | Short step name. |
| `description` | string | **Required** | What the customer or technician does at this step and what happens next. |

Count: **minimum 3, maximum 3**. Do not add a manual step number; display numbering follows array order.

### `landing.proofPoints[]`

Each proof-point object has:

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `title` | string | **Required** | Concise public trust claim. |
| `description` | string | **Required** | Accurate public explanation of the claim. |
| `source` | string | **Required** | Non-public authoring note naming the owner approval, current review, repository evidence or other verifiable source. The shared layout must not render this field. |

Count: **minimum 3, maximum 3**. A missing or vague source blocks that proof point. Historical testimonials, experience-duration claims and review quotations remain unavailable until permission and accuracy are confirmed.

### `landing.faqs[]`

Each FAQ object has:

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `question` | string | **Required** | A genuine problem-specific objection or customer question. |
| `answer` | string | **Required** | Direct answer that remains within approved price, service, guarantee and geography boundaries. |

Count: **minimum 3, maximum 6**.

### `landing.form`

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `heading` | string | **Required** | Problem-specific heading shown immediately before the shared form. |
| `introduction` | string | Optional | One concise sentence that helps the visitor describe the problem. Omit it when no additional context is needed. |
| `contextKey` | snake-case string | **Required** | Must exactly equal `landing.id`. It is the only page-authored form pain identifier. Whether Sanctum Forms can persist it is investigated later; this contract does not claim that capability. |

### `landing.schema`

| Field | Type | Presence | Contract |
|---|---|---:|---|
| `serviceType` | string | **Required** | Accurate, approved service name for Service JSON-LD. It must describe the offered service without adding claims. |
| `areaServed` | array of strings | **Required** | One or more owner-approved service areas. Do not infer areas from nearby suburbs, advertising reach or another page. |

The shared layout is responsible for escaping these values into valid JSON-LD. Page data must remain plain text.

## Shape-only YAML example

The values in angle brackets below are instructions, not approved content and must never be published as placeholders.

```yaml
---
layout: layouts/sales-landing-page.njk
title: '<UNIQUE SEO TITLE WITHOUT SITE NAME>'
description: '<UNIQUE HONEST META DESCRIPTION OF AT LEAST 50 CHARACTERS>'
permalink: /<APPROVED-PROBLEM-ROUTE>/index.html
ogImage: /img/<APPROVED-IMAGE>.webp
# Optional pair; omit both to use the base-layout defaults.
ogImageWidth: 1200
ogImageHeight: 630
landing:
  id: <APPROVED_PAIN_IDENTIFIER>
  eyebrow: '<APPROVED LOCAL RELEVANCE>'
  headline: '<EXACT CUSTOMER PAIN AND DESIRED OUTCOME>'
  promise: '<ONE PLAIN-ENGLISH DIAGNOSTIC-FIRST PARAGRAPH>'
  offer:
    label: '<APPROVED OFFER LABEL>'
    price: '<OWNER-APPROVED PRICE TEXT>'
    note: '<EXPLICIT APPROVED SCOPE AND EXCLUSIONS>'
  cta:
    primaryLabel: '<PROBLEM-SPECIFIC ENQUIRY ACTION>'
    primaryHref: '#contact'
    phoneLabel: '<PROBLEM-SPECIFIC PHONE ACTION>'
  symptoms:
    - title: '<SYMPTOM 1>'
      description: '<RECOGNISABLE DESCRIPTION WITHOUT ASSUMED DIAGNOSIS>'
    - title: '<SYMPTOM 2>'
      description: '<RECOGNISABLE DESCRIPTION WITHOUT ASSUMED DIAGNOSIS>'
    - title: '<SYMPTOM 3>'
      description: '<RECOGNISABLE DESCRIPTION WITHOUT ASSUMED DIAGNOSIS>'
  diagnosis:
    heading: '<DIAGNOSIS SECTION HEADING>'
    summary: '<WHY ASSESSMENT PRECEDES THE RECOMMENDATION>'
    checks:
      - title: '<CHECK>'
        description: '<WHAT IS ASSESSED WITHOUT PROMISING A RESULT>'
  inclusions:
    - title: '<APPROVED DELIVERABLE>'
      description: '<SCOPE AND LIMITS>'
  process:
    - title: '<STEP 1>'
      description: '<WHAT HAPPENS>'
    - title: '<STEP 2>'
      description: '<WHAT HAPPENS>'
    - title: '<STEP 3>'
      description: '<WHAT HAPPENS NEXT>'
  proofPoints:
    - title: '<TRUTHFUL PROOF 1>'
      description: '<APPROVED PUBLIC EXPLANATION>'
      source: '<NON-PUBLIC VERIFIABLE SOURCE>'
    - title: '<TRUTHFUL PROOF 2>'
      description: '<APPROVED PUBLIC EXPLANATION>'
      source: '<NON-PUBLIC VERIFIABLE SOURCE>'
    - title: '<TRUTHFUL PROOF 3>'
      description: '<APPROVED PUBLIC EXPLANATION>'
      source: '<NON-PUBLIC VERIFIABLE SOURCE>'
  faqs:
    - question: '<FAQ 1>'
      answer: '<APPROVED ANSWER>'
    - question: '<FAQ 2>'
      answer: '<APPROVED ANSWER>'
    - question: '<FAQ 3>'
      answer: '<APPROVED ANSWER>'
  form:
    heading: '<PROBLEM-SPECIFIC FORM HEADING>'
    # introduction: '<OPTIONAL SINGLE-SENTENCE PROMPT>'
    contextKey: <SAME VALUE AS landing.id>
  schema:
    serviceType: '<APPROVED SERVICE TYPE>'
    areaServed:
      - '<APPROVED SERVICE AREA>'
---
```

## Uniqueness and canonical-route rules

Before accepting a new page, compare it with every registered pain page and confirm:

- `title` is unique;
- `description` is unique;
- `landing.headline` is unique and renders as the only H1;
- `permalink` is unique and maps to one canonical public route;
- `landing.id` is unique to the pain-point family and matches `form.contextKey`.

A title, description or H1 may describe the same problem in coordinated language, but none may be copied verbatim from an unrelated page. Incoming `utm_content` identifies an advertisement variant; do not hard-code campaign UTMs into the page contract.

## Claims and approval gate

Do not create, infer or publish:

- a price, call-out policy, service area or service inclusion without owner approval;
- a testimonial or review quotation without current permission and an accurate source;
- an experience-duration claim such as `since 2004` until its continuity wording is approved;
- a guarantee of diagnosis, repair, turnaround, coverage, recovered funds or third-party action;
- false scarcity, countdowns, limited-time urgency or fear-heavy claims;
- a claim that the visitor has malware, has been scammed or has a private condition merely because they reached the page.

If an approved offer or explicit exclusions are unavailable, stop the page task as blocked. Do not satisfy the schema with guessed copy or a publishable placeholder.

## Tone override for scam and security pages

The default Naked Tech voice may be distinctive and lightly cheeky where the problem is low-stakes. For `landing.id: scam_security`, every customer-facing field must instead be calm, non-judgemental and action-oriented:

- no cheeky service labels;
- no fear escalation or alarmist urgency;
- no implication that the visitor caused the incident;
- no promise to recover stolen funds;
- clear boundaries between device/account assistance and actions owned by banks, Scamwatch, ReportCyber or other third parties.

This is an editorial override, not a template branch. The same shared layout and field contract apply.

## P1-T1 acceptance checklist

- [x] Every field in the contract is marked required or optional.
- [x] `symptoms`, `process` and `proofPoints` each require exactly 3 items.
- [x] `faqs` requires 3–6 items.
- [x] Unique SEO title, description, H1 and canonical route are mandatory.
- [x] The offer requires owner-approved price/scope text and explicit exclusions.
- [x] Unsupported testimonials, guarantees and urgency claims are prohibited.
- [x] Scam/security copy has a documented calm-tone override.
- [x] A page can be authored from this document without inspecting an unrelated landing-page file.
