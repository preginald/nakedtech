# Meta Test 01 — Campaign Structure and Budget Proposal

**Prepared:** 29 July 2026<br>
**Status:** Launched 30 July 2026 — controlled delivery and measurement in progress<br>
**Canonical phase:** Phase 5 delivery<br>
**Creative source:** `docs/marketing/meta-test-01-creative-brief.md`<br>
**Canonical plan:** `.hermes/plans/2026-07-28_123314-naked-tech-pain-point-landing-pages.md`

## Approval boundary

This proposal originally defined the campaign, budget, audience, placements, schedule, names and safety controls for approval. It did **not** itself authorise a launch.

No Meta campaign, ad set, ad, draft, media upload, budget, audience, placement, schedule, publication or delivery state was changed while preparing the original proposal. After P5-T2 approval, the approved structure was assembled as an unpublished/off draft and captured for review. P5-T3 then passed, and a later separate owner decision authorised the launch recorded below.

**Owner decision — 29 July 2026:** Approved the revised sequential pilot. This approval records the structure, controls and maximum budget below; it does not itself authorise publication, activation or spend.

**Owner amendment — 29 July 2026:** After Meta required a minimum AUD `$45` lifetime budget, the owner approved two `$45` sequential arms with delivery restricted to Monday–Friday, `09:00–17:00` Australia/Melbourne time. The owner accepted the narrower weekday-only evidence base and retained the directional-only interpretation. The revised maximum is AUD `$90`, and the requested earliest Arm A start is Thursday 30 July 2026 at `09:00` AEST. The owner then selected **Slow Computer first, followed by Wi-Fi**; this supersedes the earlier random Wi-Fi-first ordering. This amendment still does not authorise publication, activation or spend.

**Owner audience variance — 29 July 2026:** The live Advantage+ Leads editor caps the hard minimum-age control at `25`. The owner approved retaining that hard floor, setting the age suggestion to `35–65+`, keeping all genders and no detailed targeting, and documenting/reporting any delivery to ages `25–34`. Ivanhoe and Eaglemont remain hard controls. This platform-required variance is not permission for location expansion or launch.

**Owner placement variance — 29 July 2026:** The live Advantage+ Leads editor does not expose a manual-placement switch and includes `21` placements across Facebook, Instagram, Audience Network, Messenger and Threads. The owner approved accepting identical Advantage+ placements for both arms as the fastest commercial path. Every material preview must pass before launch, results must be reported by platform and placement, and Stories/Reels require dedicated `9:16` derivatives rather than unreviewed automatic crops. This variance does not authorise publication or spend.

**Platform spending-limit constraint — 29 July 2026:** Meta requires a minimum AUD `$100` campaign spending limit for this currency. Retain that optional secondary limit, but treat the two `$45` ad-set lifetime budgets as the binding authorised maximum of AUD `$90`. The `$100` campaign limit cannot allocate or force the additional `$10`; no ad set may exceed its approved `$45` lifetime budget and unused budget may not be transferred.

**Owner timing variance — 30 July 2026:** After the original `09:00` start passed while the draft remained unpublished/off, the owner chose to retain the 30 July eligibility date and allow Slow Computer to begin only after P5-T3, explicit launch approval, publication and Meta review complete. The owner accepts a shortened first delivery day and weaker pacing comparability. Arm A still ends Wednesday 5 August at `17:00`; do not force missed spend through the remaining hours.

**Owner live-placement exception — 30 July 2026:** During Off/unpublished Slow Computer ad assembly, Meta reported three unavailable placements. `Audience Network rewarded videos` requires video and is incompatible with the approved static-image test. `Threads feed` requires a Threads profile or Instagram account not selected for the Naked Tech identity. `Instagram Feed` returned Meta's persistent internal creative-processing error `opes_mid: 1fef521ac122d374d83033a23193f40a`; the same error remained after the approved `1080 × 1080` square rendered successfully in the placement editor and after a controlled retry with the approved `1080 × 1350` Feed master. The owner approved proceeding with these three placements unavailable in the Off draft, with the Instagram error documented and rechecked at P5-T3. Instagram Feed must not silently become an accepted launch variance: it must either clear before publication or receive a fresh explicit owner launch decision. Apply the same effective placement availability to Arm B or treat the comparison as placement-mismatched.

**Final P5-T2 placement readback — 30 July 2026:** The Instagram Feed processing error cleared after the final native-ratio creative was saved. Arm A now reports two unavailable placements: `Audience Network rewarded videos` and `Threads feed`. Arm B reports only `Audience Network rewarded videos`. Effective placement availability is therefore still mismatched. No identity or placement setting was changed to conceal the mismatch; it is a P5-T3 launch blocker requiring symmetric resolution or a fresh explicit owner launch decision.

**P5-T3 draft correction and readback — 30 July 2026:** The owner approved the recommended draft-only parity and operating-window corrections. The live Threads selector showed that Arm B uses `Use Facebook Page`, not a separately linked Threads account; Arm A was set to the same value. Both ads now report only `Audience Network rewarded videos` as unavailable because the approved static media is not video. Deterministic schedule-grid inspection also found both ad sets selected hourly cells `9..17`, meaning `09:00–18:00`; hour `17` was cleared Monday–Friday in both arms. Fresh reopen/readback confirmed selected cells `9..16`, meaning `[09:00,17:00)`, with weekends empty. All five campaign objects remain unpublished, Off and `In draft`, with blank delivery/results/spend and `Review and publish (5)`. These corrections do not authorise launch.

## Subsequent launch record — 30 July 2026

After the technical audit, a separate owner decision authorised publication, activation and the approved maximum spend. Before publication, Arm A's end was extended to Thursday 6 August 2026 at `17:00` AEST; its AUD `$45` lifetime budget and weekday `[09:00,17:00)` hours remained unchanged. Arm B retained Monday 10 August through Friday 14 August with the same hours and budget.

Ads Manager's final review contained one campaign, two ad sets and two ads and reported no object-level errors. Publication completed for all five objects. The immediate post-publish readback showed the Slow Computer arm active, the Wi-Fi arm scheduled, both ads switched on, both lifetime budgets at AUD `$45`, and `$0.00` spent at the captured checkpoint.

Raw Ads Manager captures are intentionally excluded from this public repository because they expose account UI and profile identifiers. Their descriptions and SHA-256 hashes are retained in `docs/marketing/evidence/meta-test-01/README.md`; the public analytics contract remains alongside that manifest.

## Executive recommendation

Run one new local **Leads** campaign with two identical, non-overlapping ad-set arms:

1. **Slow computer** — up to AUD `$45` lifetime budget across five weekday delivery days, starting Thursday 30 July.
2. An **at-least-72-hour no-delivery washout**.
3. **Wi-Fi dropouts** — up to AUD `$45` lifetime budget across the following Monday–Friday delivery window.

Each ad set contains exactly one approved ad. The two ad sets differ only in the pain, approved copy/media and matching destination. Campaign budget optimisation and ad-set budget sharing stay off, so Meta cannot move budget from one concept to the other.

Both arms use the same weekday schedule: Monday–Friday, `09:00–17:00` Australia/Melbourne time. Weekend delivery is excluded because Naked Tech does not operate on weekends and the current landing pages do not promise a weekend response. Each arm still covers every weekday exactly once; the result therefore describes weekday demand only.

This is the smallest justified exception to the canonical one-ad-set preference. Meta budgets exist at campaign or ad-set level, not per ad. Putting both ads in one ad set would let Meta optimise delivery unevenly, while manually stopping one ad near `$45` would rely on a daily target that can vary substantially by day. Separate fixed-lifetime ad-set containers make the `$45` allocation explicit and auditable.

## Why not a formal Meta A/B test?

A formal simultaneous split test is not recommended for this first **up-to-`$90`** local experiment:

- it would divide an already small historical audience estimate of roughly `10,600–12,500` people into still smaller arms;
- `$45` per arm is not enough to expect a statistically conclusive winner;
- the experiment needs directional evidence about pain/offer resonance, not a false claim of statistical certainty;
- sequential windows let each concept access the full local audience and avoid auction overlap between nearly identical audiences.

Meta explicitly recommends formal A/B testing over informally switching campaigns or ad sets because its test container splits the audience, avoids cross-arm exposure and supports a statistically comparable result. Meta also says the audience must be large enough and the budget must produce enough results to determine a winner. This proposal deliberately chooses a **directional** sequential pilot because the local audience and `$45`-per-arm budget do not satisfy that stronger conclusion standard. It must not be reported as a Meta-significant A/B result.

The trade-off is time-period bias and possible exposure of the same person to both concepts. That is reduced—not eliminated—by giving each concept the same five weekday delivery days and `09:00–17:00` hours, inserting an at-least-72-hour washout, keeping every other setting fixed and making no performance edits during either window. Arm A crosses a weekend while Arm B runs across one continuous Monday–Friday period; the owner explicitly accepts that weaker pacing comparability in exchange for starting Arm A immediately. Both arms still contain each weekday exactly once. Excluding weekends narrows the evidence to weekday demand and reduces available delivery volume.

### What the washout means

A washout is a deliberate period in which **neither test arm delivers or spends**. It reduces immediate carryover from Arm A into Arm B: recent ad recall, audience fatigue, delayed site visits and the chance that the second concept begins while the first concept is still dominating attention. It is a separation period, not an additional budget or a third campaign stage.

The washout cannot make sequential arms fully comparable. Auction conditions and local demand can change with calendar time; the same person may still encounter both concepts; and Meta's `7-day click, 1-day view` attribution window is longer than the planned 112-hour washout. A conversion may therefore occur during the washout or early Arm B window and still be correctly attributed to an earlier Arm A click. Results remain directional and must be read by ad set rather than by raw calendar-day totals alone.

### Alternative if experimental validity is preferred over reach

Use Meta's formal A/B test with the same two identical ad-set arms, run simultaneously for at least seven days with equal `$45` budgets. This is methodologically cleaner and is Meta's recommended comparison mechanism, but it splits the local audience and is still unlikely to have enough website Leads for a conclusive winner. Select this alternative only if the owner accepts the higher repetition/fragmentation risk and the same `directional unless powered` interpretation.

## Read-only evidence used

### Meta and campaign history

- A read-only check earlier on 29 July 2026 found campaign `Naked Tech — Ivanhoe Leads`, ad set `New Leads ad set` and ad `New Leads ad` all off, with `$5.00 Daily` displayed. No setting was changed.
- A fresh authenticated inspection was attempted while preparing this proposal, but the available browser session redirected to Meta login. Current account state is therefore **not claimed**. It must be rechecked from authenticated Ads Manager immediately before any approved draft construction.
- The preserved campaign export at `/home/preginald/Downloads/Naked-Tech-Ads-Campaigns-28-Jun-2026-27-Jul-2026.csv` contains one inactive campaign row: `$18.84` spend, `2,163` impressions, `592` reach, `3.65` frequency and `$5` daily ad-set budget. It contains no click or landing-page-view fields.
- Historical setup evidence showed Advantage+ Leads enabled, Ivanhoe and Eaglemont selected as locations, and an estimated audience around `10,600–12,500`. Exact current controls, age, placements and audience estimate must be read back before construction rather than inferred from that snapshot.

### Live destinations

Both approved URLs returned HTTP `200` on 29 July 2026 and retained their complete UTMs:

- Wi-Fi H1: `Wi-Fi keeps dropping out? Find the cause before buying more hardware.`
- Slow-computer H1: `Computer painfully slow? Find out whether to fix, upgrade or replace.`

The Wi-Fi page still exposes `services-hero.webp` as its Open Graph image. The slow-computer page exposes `slow-computer-help-og.webp`.

### Current Meta guidance used

- Meta states that a lifetime budget is the total amount available over the entire campaign/ad-set runtime and is useful when the advertiser does not want to exceed a defined overall spend: <https://www.facebook.com/business/help/1844835042445690>
- Meta states that daily budgets are daily targets over a calendar week and may spend up to `75%` above the entered daily amount on an individual day while remaining within platform limits: <https://www.facebook.com/business/help/190490051321426>
- Meta documents budgets at campaign or ad-set level and identifies ad-set budgets as the option for controlling spend by ad set; ad-set budget sharing can move up to `20%` and is therefore disabled here: <https://www.facebook.com/business/help/458847204894307>
- Meta says formal A/B tests split the audience so nobody sees both versions, recommends equal budgets, and warns that manually switching campaigns/ad sets can produce unreliable results: <https://www.facebook.com/business/help/1738164643098669>
- Meta's A/B best practices require identical arms except for the tested variable, a sufficiently large unused audience, enough budget to determine a winner and at least seven days for more reliable results: <https://www.facebook.com/business/help/290009911394576>
- Meta's current Facebook Feed image guide recommends a `4:5` ratio: <https://www.facebook.com/business/ads-guide/update/image/facebook-feed>

## Proposed Meta object structure

```text
Campaign: Naked Tech — Pain Test 01 — Website Leads
├── Ad set A: P5-T2 A — Slow Computer — Ivanhoe + Eaglemont — Advantage+ — $45
│   └── Ad: Slow Computer — v3 — Learn More
└── Ad set B: P5-T2 B — Wi-Fi — Ivanhoe + Eaglemont — Advantage+ — $45
    └── Ad: Wi-Fi Dropouts — v1 — Learn More
```

The existing `Naked Tech — Ivanhoe Leads` campaign and its generic ad remain off. They are not reused, renamed or deleted. This preserves the historical baseline and keeps Test 01 reporting clean.

## Campaign-level settings

| Setting | Proposal |
|---|---|
| Buying type | Auction |
| Objective | Leads |
| Conversion location | Website |
| Special Ad Category | None, subject to Meta's final policy review |
| Advantage+ campaign budget / campaign budget optimisation | Off |
| A/B test toggle / Experiments container | Off |
| Campaign spending limit | AUD `$100`, Meta's minimum supported secondary safety limit; the binding authorised campaign maximum remains `$90` through two `$45` ad-set lifetime budgets |
| Campaign state | Constructed Off/unpublished; subsequently approved and published 30 July 2026 |

## Identical ad-set settings

The two arms must match exactly except for name, schedule and concept-specific ad.

| Setting | Proposal |
|---|---|
| Dataset / Pixel | `Naked Tech Website` / `1010322558552545` |
| Performance goal | Maximise number of leads |
| Conversion event | `Lead` |
| Bid strategy | Highest volume; no cost cap |
| Attribution | `7-day click, 1-day view` unless the live account requires a different supported default; any difference blocks construction pending approval |
| Budget type | Ad-set lifetime budget |
| Lifetime budget | AUD `$45` per arm — Meta's minimum accepted value for the approved schedule |
| Ad-set budget sharing | Off |
| Geography | Ivanhoe VIC and Eaglemont VIC as hard location controls |
| Radius expansion | None; do not add a 5 km radius that spills beyond the approved service area |
| Age | Hard minimum `25`; suggested range `35–65+`. Advantage+ may deliver to `25–34`; report that delivery separately |
| Gender | All |
| Languages | No restriction |
| Detailed targeting | None — no homeowner, technology-interest or behaviour filters |
| Audience expansion | Advantage+ Leads is required by the live workflow. Ivanhoe/Eaglemont and minimum age `25` remain hard; age `35–65+` is a suggestion. Record the exact UI state and report `25–34` delivery separately |
| Placements | Advantage+: `21` included across Facebook, Instagram, Audience Network, Messenger and Threads; identical in both arms and reported by platform/placement |
| Devices | All devices supported by the Advantage+ placement set |
| Schedule timezone | Ad-account timezone, expected `Australia/Melbourne`; verify before construction |
| Delivery schedule | Monday–Friday only, `09:00–17:00`; no weekend delivery |

The geographic area is intentionally narrow, but the people within it remain broad. Pain-specific creative does the self-selection. Interest and homeowner filters would make the sample smaller and introduce another unmeasured variable.

## Budget and schedule

| Period | Lifetime budget | Calendar window | Eligible delivery | Active duration |
|---|---:|---|---|---:|
| A — Slow computer | Up to AUD `$45` | Eligible from Thursday 30 July 2026 after launch and Meta review → Thursday 6 August 2026, 17:00 AEST | Monday–Friday, `09:00–17:00`; shortened first day accepted | Determined by actual approved delivery start and review completion |
| Washout — no test delivery | AUD `$0` | Thursday 6 August 2026, 17:00 AEST → Monday 10 August 2026, 09:00 AEST | None | 88 hours |
| B — Wi-Fi dropouts | Up to AUD `$45`, matched to Arm A if A stops early | Monday 10 August 2026, 09:00 AEST → Friday 14 August 2026, 17:00 AEST | Monday–Friday, `09:00–17:00` | 40 hours |

The earlier Wi-Fi-first order came from a one-time random draw (`wifi_then_slow`); it had no strategic or technical advantage. On 29 July 2026 the owner explicitly superseded that draw and selected Slow Computer first because it better matches the desired immediate commercial focus. Changing the order does not materially weaken this already-directional design because budget, weekday coverage, hours, audience, placements and controls remain matched.

The owner explicitly accepted a shortened first Arm A day after the original `09:00` gate was missed. The separately approved launch extended Arm A's end by one weekday to 6 August without raising its lifetime budget or delivery hours. Arm B retains its full Monday–Friday window.

### Budget interpretation

`$45` per arm is an exploratory **ceiling**, not spend that must be forced through the audience and not enough to promise statistical significance. Across five eight-hour delivery days it is equivalent to `$9.00` per active day if paced evenly, but Meta controls actual pacing within the lifetime cap. At the historical `$8.71` CPM it would correspond to roughly `5,166` impressions per arm if market conditions remained similar. If reach stayed near the prior `592`, that would imply frequency around `8.73`; frequency `4.0` would occur around `$20.63`. These are scenarios—not forecasts—but they make a hard fatigue stop necessary.

## Placement and asset mapping

### Included

- The identical live Advantage+ placement set in both arms: `21` placements across Facebook, Instagram, Audience Network, Messenger and Threads.
- Map the approved `1080 × 1350` (`4:5`) and `1080 × 1080` (`1:1`) files to compatible feed/square placements.
- Create and obtain owner approval for a dedicated `1080 × 1920` (`9:16`) derivative per concept before Stories/Reels delivery is authorised.
- Where Meta exposes its additional horizontal bucket, use a separately inspected and owner-approved `1200 × 628` (`1.91:1`) file rather than a destructive automatic crop.

### Controlled variance

Placement mix is no longer held to Facebook Feed only. Fairness instead requires the exact same Advantage+ placement set and aspect-ratio system in both arms, no placement exclusions or bid rules applied to only one arm, preview verification, and reporting by platform and placement.

Turn off automated media/copy treatments that would alter the approved comparison, including unreviewed automatic cropping, image expansion, generated backgrounds, text rewrites, overlays, animation and music. Use only approved `4:5`, `1:1`, dedicated `9:16` and exposed `1.91:1` files for their intended placement ratios and capture every material preview.

For the Slow Computer draft, all four ratio families are owner-approved and assigned. Six Meta enhancement switches are explicitly Off, image generation uses `0` AI media, `Optimise text per person` is Disabled, all three Essential enhancements are Off, and the exact approved copy/CTA are assigned. After the P5-T3 Threads identity correction, effective non-delivery is limited to Audience Network rewarded videos, identically to Arm B. Instagram Feed renders without the earlier processing warning.

### Historical P5-T2 unpublished-draft readback — 30 July 2026

- Campaign `Naked Tech — Pain Test 01 — Website Leads` is Off and `In draft`; delivery, results and spend are blank.
- Both named ad sets are Off and `In draft`, each with a `$45.00 Lifetime` budget and blank delivery, results and spend.
- Both named ads are Off and `In draft`, each showing the corresponding `$45.00 Lifetime` ad-set budget and blank delivery, results and spend.
- Arm A uses the exact approved Slow Computer primary text, headline, description and `Learn more` CTA; Arm B uses its exact approved Wi-Fi copy and the same CTA.
- Both ads use supplied native-ratio media only, `0` AI-generated media, Disabled per-person text optimisation, six standard creative enhancements Off and three Essential enhancements Off.
- The five changed objects remain unpublished, as shown by Ads Manager's `Review and publish (5)` control. No publication, activation, delivery submission or spend authorisation occurred.
- Final raw evidence is retained privately under `docs/marketing/evidence/meta-test-01/p5-t2/`, including files `78`–`83` for the corrected Arm A copy/controls, campaign/ad-set/ad safety readbacks and final warning state. It is excluded from public Git because the Ads Manager chrome exposes account and profile identifiers.
- At the P5-T2 checkpoint, placement parity was not achieved: Arm A excluded rewarded video and Threads feed while Arm B excluded rewarded video only. This historical blocker was resolved in P5-T3 below.

### P5-T3 technical audit and corrections — 30 July 2026

- The Threads identity mismatch is resolved: both ads use `Use Facebook Page` for Threads delivery.
- Both ads now have the same sole unavailable placement, `Audience Network rewarded videos`, because the approved media is static rather than video.
- Both schedule grids were corrected from `09:00–18:00` to Monday–Friday `[09:00,17:00)`, with Saturday and Sunday empty.
- Exact destinations, UTMs, mobile rendering, visible Meta previews, conversion controls, budgets, geography and analytics/form-message behavior passed the retained audit.
- Post-correction campaign, ad-set and ad tables remained Off / `In draft` with no delivery or spend at the audit checkpoint.
- Full audit evidence and the subsequent approved launch record are documented in `docs/marketing/meta-test-01-p5-t3-pre-launch-audit.md`.

## Ad-level contract

| Field | Wi-Fi arm | Slow-computer arm |
|---|---|---|
| Identity | Naked Tech Facebook Page | Naked Tech Facebook Page |
| Format | Single image | Single image |
| CTA | Learn More | Learn More |
| Copy | Exact approved copy in `meta-test-01-creative-brief.md` | Exact approved copy in `meta-test-01-creative-brief.md` |
| Headline | `Wi-Fi keeps dropping out? Find the cause.` | `Slow computer? Fix, upgrade or replace.` |
| Description | `$190 fixed-price diagnosis · Ivanhoe & Eaglemont` | `$190 fixed · 60–75 min onsite · Ivanhoe & Eaglemont` |
| UTM content | `wifi_dropouts_v1` | `slow_computer_v1` |

Exact destinations:

```text
https://nakedtech.au/services/wifi-dropouts-ivanhoe/?utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01&utm_content=wifi_dropouts_v1

https://nakedtech.au/services/slow-computer-help-ivanhoe/?utm_source=facebook&utm_medium=paid_social&utm_campaign=naked_tech_pain_points_01&utm_content=slow_computer_v1
```

Do not add alternate copy, dynamic text, another headline, another CTA, a carousel, catalogue content or a second offer.

## Open Graph decision

Do not change the Wi-Fi page Open Graph image as part of P5-T2. The ad uses a manually assigned approved `4:5` feed asset, so the current generic OG image is not automatically a launch blocker.

P5-T3 inspected the loaded rendered Meta previews. The visible Wi-Fi cards used the intended approved media and did not surface `services-hero.webp`; the visible Slow Computer cards also matched their approved concept. If a future preview unexpectedly substitutes the generic hero before publication, stop and create a dedicated owner-approved `1200 × 630` derivative rather than stretching the `4:5` feed asset.

## Monitoring and fairness rules

1. Only one arm may deliver at a time.
2. Do not change copy, media, audience, placements, budget, schedule or optimisation during either weekday-delivery calendar window.
3. Perform a read-only technical-health check after 24 hours; do not optimise from early performance.
4. Pause immediately only for a wrong URL/UTM, broken destination, wrong creative, event duplication/failure, out-of-area delivery, policy issue or spend-control failure.
5. Each arm ends at the first of: five scheduled weekday delivery days, `$45` actual spend, ad-level frequency `4.0`, or a technical/integrity failure.
6. If Arm A stops below `$45` for frequency or safety, Arm B's valid-spend ceiling becomes Arm A's actual valid spend. Match within `5%` where possible. If Arm B reaches its own frequency/safety stop before matching, report the comparison as `inconclusive`.
7. Do not transfer any unused amount between arms. Total spend remains at or below `$90`.
8. Wait at least 48 hours after Arm B ends before the final attribution export and Phase 6 decision record.

## Historical evidence requirement before publication

Capture and retain screenshots or an export showing:

- campaign objective, campaign-budget state and total spending limit;
- each ad set's lifetime budget, timezone, exact start/end, conversion location, Pixel/event and attribution;
- exact Ivanhoe/Eaglemont controls, audience estimate, hard minimum age `25`, suggested age `35–65+`, all genders and absence of detailed targeting;
- the identical Advantage+ placement set in both arms;
- placement-specific creative previews using approved `4:5`, `1:1`, dedicated `9:16` and exposed `1.91:1` files, with no unreviewed automatic crop or enhancement;
- the exact unavailable-placement list and resolution or fresh owner acceptance of any material P5-T3 launch variance, including the Instagram Feed internal error;
- exact primary text, headline, description, CTA and destination including UTMs;
- existing generic campaign/ad still off;
- all new campaign, ad-set and ad toggles off before the separate launch decision.

The export after delivery must be at Ads level and include amount spent, impressions, reach, frequency, CPM, outbound clicks, landing-page views, link CTR, link CPC, `Contact`, `Lead`, cost per lead, platform, placement and age breakdown. Report any `25–34` spend/results explicitly. Clicks alone do not decide a winner.

## Interpretation limits

This test can show directional differences in weekday attention and funnel behaviour; it cannot guarantee a statistically significant winner at `$45` per arm and says nothing about weekend demand. Interpret in order:

1. impressions → outbound clicks;
2. outbound clicks → landing-page views;
3. landing-page views → telephone/form actions;
4. enquiries → qualified jobs and gross margin.

Zero leads after a small number of clicks is not proof that a concept failed. If neither arm reaches a meaningful sample, the correct outcome is `insufficient evidence`, not a forced winner.

## Owner approval record

The owner approved all of these items on 29 July 2026:

1. One new Leads campaign with **two sequential, identical ad-set budget containers**, not Meta's formal A/B test.
2. AUD **`$90` binding maximum** through two **up-to-`$45` lifetime ad-set budgets**, with Meta's minimum `$100` campaign spending limit acting only as a non-binding secondary stop, a frequency-`4.0` hard stop and matched lower spend if Arm A stops early.
3. The 30 July eligibility date, actual Slow Computer delivery only after P5-T3/launch approval/publication/Meta review, the owner-accepted shortened first day, Slow-Computer-first order, weekday-only `09:00–17:00` delivery and final 88-hour washout.
4. Ivanhoe and Eaglemont hard location controls; hard minimum age `25` with suggested age `35–65+`; all genders; no interests or homeowner filter; separate reporting of any `25–34` delivery.
5. Identical **Advantage+ placements** in both arms, with approved `4:5`, `1:1`, dedicated `9:16` and exposed `1.91:1` derivatives, preview verification and platform/placement-level reporting.
6. Exact campaign/ad-set/ad names and the old generic campaign remaining off.
7. Construction after approval is limited to unpublished/off settings and evidence capture. P5-T3 and explicit launch approval remain mandatory before publication or spend.
8. Proceeding with the documented unavailable placements in the Off P5-T2 draft. The Instagram Feed error subsequently cleared; the remaining Arm A Threads-feed mismatch still requires symmetric resolution or a fresh explicit owner decision at P5-T3 before publication.
9. The P5-T3 draft-only corrections: match Arm A's Threads selector to Arm B's `Use Facebook Page` setting, retain rewarded video as an identical unsupported placement in both arms, and correct both weekday grids to `[09:00,17:00)`. This approval did not include publication, activation or spend.
