# Meta Test 01 — P5-T3 Pre-launch Audit

**Date:** 30 July 2026<br>
**Status:** Technical audit passed; separately approved launch completed 30 July 2026<br>
**Campaign:** `Naked Tech — Pain Test 01 — Website Leads`<br>
**Private raw evidence:** `docs/marketing/evidence/meta-test-01/p5-t3/` (excluded from public Git; hashes are in the public evidence manifest)

## Historical approval boundary

The owner's instruction to proceed with the recommendation authorised only the reversible unpublished-draft corrections recorded below. It did **not** authorise `Publish`, `Review and publish`, activation, delivery, spend, a commit, a push or a deployment.

After the corrections, Ads Manager still showed `Review and publish (5)`. The campaign, both ad sets and both ads remained Off / `In draft`; all target rows retained blank delivery/results/spend. No launch control was used.

## Approved draft corrections

### 1. Threads identity parity

The live selector clarified that Arm B was not using a standalone Threads account named `Naked Tech`; its Threads identity setting was `Use Facebook Page`. Arm A originally said `Select a Threads profile`. The approved parity correction therefore set Arm A's Threads selector to the same `Use Facebook Page` value as Arm B.

Post-correction readback:

- both ads use Facebook Page `Naked Tech`;
- both use Instagram identity `Use Facebook Page`;
- both use Threads identity `Use Facebook Page`;
- both now report exactly one unavailable placement;
- in both ads, the sole warning is `Audience Network rewarded videos` because that placement requires video;
- no ad-set placement was excluded, and no creative was replaced.

Rewarded video remains a symmetric accepted limitation for this static-image directional test. Supplying video only to satisfy that placement would introduce a new creative variable.

### 2. Weekday delivery-hour correction

The schedule summaries said `5 schedules`, but deterministic grid inspection found selected hourly cells `9..17`, which means `09:00–18:00`, not the approved `09:00–17:00` window. Both ad sets were corrected by clearing hour cell `17` on Monday through Friday.

Fresh readback after navigating away and reopening each ad set confirmed:

- Monday–Friday selected cells: `9..16`, meaning `[09:00, 17:00)`;
- Saturday and Sunday: no selected cells;
- ad scheduling remains enabled;
- account timezone: Sydney Time / GMT+10;
- Arm A calendar window remains 30 July 2026 09:00 through 5 August 2026 17:00;
- Arm B calendar window remains 10 August 2026 09:00 through 14 August 2026 17:00;
- both ad sets retain an AUD `$45.00` lifetime budget.

## Configuration readback

| Control | Verified draft value |
|---|---|
| Campaign objective | Leads |
| Conversion location | Website |
| Performance goal | Maximise number of conversions |
| Dataset | Naked Tech Website / Pixel `1010322558552545` |
| Conversion event | Lead |
| Campaign budget | Off; ad-set budgets used |
| Ad-set budgets | AUD `$45.00` lifetime per arm; AUD `$90` binding combined ceiling |
| Geography — Arm A | `Inclusion: Australia: Ivanhoe Victoria, Eaglemont Victoria` |
| Geography — Arm B | `Inclusion: Australia: Ivanhoe Victoria, Eaglemont Victoria` |
| Placements | Identical Advantage+ placement configuration; no ad-set exclusions |
| Effective unavailable placement | Audience Network rewarded videos only, identically on both ads |
| Delivery hours | Monday–Friday `[09:00,17:00)`; weekends empty |
| Draft safety state | Campaign, two ad sets and two ads Off / `In draft`; no delivery or spend |

## Destinations, message match and previews

Both exact production URLs loaded successfully and retained every approved UTM:

- Slow Computer: `https://nakedtech.au/services/slow-computer-help-ivanhoe/?utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01&utm_content=slow_computer_v1`
- Wi-Fi: `https://nakedtech.au/services/wifi-dropouts-ivanhoe/?utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01&utm_content=wifi_dropouts_v1`

Verified at a true `390 × 844` mobile viewport:

- correct problem and locality message match;
- no recorded critical clipping or horizontal overflow;
- CTA, phone path and contact-form embed available;
- the visible Meta Advanced Preview cards used the intended Slow Computer and Wi-Fi copy/media;
- no generic `services-hero.webp` substitution appeared after preview assets loaded.

The preview screenshots prove the rendered cards visible in their captured viewports; they do not claim exhaustive proof of every possible Meta placement.

## Analytics and form contract

A deterministic live-page harness intercepted analytics calls, clicked a telephone link with navigation prevented, sent a wrong-origin form message, then sent duplicate valid `started` and `submitted` messages. No external form submission or retained fake lead was created.

Each landing page emitted exactly one contractual event despite the duplicate messages:

- Meta: `PageView`, `ViewContent`, `Contact`, `Lead`;
- GA4: `view_service`, `phone_click`, `form_start`, `generate_lead`.

The wrong-origin message emitted no contractual event. Each pain-specific event retained the correct `page_path`, `pain_point` and `campaign_content`. Exact captured calls are retained in `20-live-analytics-event-contract.json`.

## Evidence index

Key retained evidence includes:

- `01`–`03`: initial campaign/ad-set/ad Off / In-draft / zero-delivery state;
- `04`–`05`: pre-correction identity and warning diagnosis;
- `06`–`07`: true-mobile destination captures;
- `08`–`09`: loaded Meta Advanced Previews;
- `10`: campaign objective/budget controls;
- `11`: pre-correction Arm B `09:00–18:00` schedule discovery;
- `12`–`13`: corrected Arm A and Arm B `[09:00,17:00)` schedule grids;
- `14`–`16`: post-correction identity parity and identical rewarded-video-only warnings;
- `17`–`19`: final campaign/ad-set/ad Off / In-draft / zero-delivery readback;
- `20`: exact live analytics/form-message contract output.

## Launch decision gate

**Technical result: PASS, with one symmetric accepted placement limitation.**

P5-T3 removed the placement-parity and schedule-integrity blockers. At the audit checkpoint the campaign remained unpublished and Off; a later separate owner decision authorised the launch recorded below.

## Post-audit launch record — 30 July 2026

The owner separately approved publication, activation and the approved maximum spend after reviewing the clean P5-T3 gate. Arm A's end was extended to Thursday 6 August 2026 at `17:00` AEST while retaining its AUD `$45` lifetime budget and weekday `[09:00,17:00)` schedule. Arm B retained 10–14 August with the same hours and budget.

The final Ads Manager review contained one campaign, two ad sets and two ads and displayed no object-level errors. Publication completed for all five objects. Immediate readback showed:

- Slow Computer ad set and ad: `Active`;
- Wi-Fi ad set and ad: `Scheduled`;
- both ad-set lifetime budgets: AUD `$45.00`;
- spend at the retained checkpoint: `$0.00` for each arm; and
- no results or impressions claimed at that immediate checkpoint.

These observations prove configuration and launch state only. They do not prove sustained delivery, spend, leads or a winning concept. Performance assessment remains Phase 6 work after both delivery windows and the attribution-settling period.

The raw launch screenshots are not committed to this public repository because their Ads Manager chrome exposes account and profile identifiers. The public-safe evidence manifest records their filenames, descriptions and SHA-256 hashes at `docs/marketing/evidence/meta-test-01/README.md`.
