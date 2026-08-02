# Meta Test 01 — Public Evidence Manifest

This directory contains public-safe, machine-readable evidence for the first Naked Tech Meta pain-point experiment. Raw Ads Manager screenshots are deliberately excluded from the public repository because their account chrome exposes an advertising-account identifier and operator profile image.

The private raw evidence was reviewed on 2 August 2026. It confirmed a final five-object review, successful publication, Slow Computer active, Wi-Fi scheduled, AUD `$45` lifetime budgets and zero spend at the immediate post-publish checkpoint. The screenshots do not establish later delivery or performance.

## Public evidence

- `p5-t3/20-live-analytics-event-contract.json` — deterministic landing-page Meta Pixel, GA4, telephone and form-message contract capture; no retained fake lead or external analytics mutation.
- `docs/marketing/meta-test-01-p5-t3-pre-launch-audit.md` — technical audit and subsequent launch record.
- `docs/marketing/meta-test-01-campaign-structure-and-budget-proposal.md` — approved structure, controls and delivery windows.

## Private launch-capture integrity

| Capture | Public-safe description | SHA-256 |
|---|---|---|
| `21-arm-a-launch-extension-6-august-1700.png` | Arm A retained AUD `$45` lifetime budget and extended its end to 6 August 2026 at 17:00 AEST | `26bf438499ea29281cca186a5f4d436eb2d2599df25b3efa1c60db77767069fd` |
| `22-launch-review-five-objects-no-errors.png` | Final review contained one campaign, two ad sets and two ads with no reported object errors | `4358df9904097b70d449b820f9fbdbca056c1421207205dfd6e6239b6da2f3e4` |
| `23-publish-success-five-objects.png` | Publication accepted; immediate Ads Manager processing state visible behind the post-publish budget recommendation | `5344b69062ea70c81b77a6336c4f86b4244c75b0ec832b2fdd6207537ab848f6` |
| `24-post-publish-ads-on-processing-zero-spend.png` | Both ads switched on and processing with zero spend at the immediate checkpoint | `210eff97d80522b31ae53e3561561a305532a6d8e3f704ce80510e77ef719a80` |
| `25-post-publish-adsets-active-scheduled-zero-spend.png` | Slow Computer ad set active; Wi-Fi ad set scheduled; both at zero spend | `2b04f2fa9eb3307af158c8824b0f990192d9e2c034a69d759cf05cd613b70529` |
| `26-post-publish-ads-active-scheduled-zero-spend.png` | Slow Computer ad active; Wi-Fi ad scheduled; both at zero spend | `d21dd0b6ce832b6350ed0d2a55880b4227cd3b57114415b7f4da9a6422ddffe7` |

The raw files should remain in private operator evidence storage. A future disclosure or audit can verify a supplied capture against this manifest without publishing account UI or personal identifiers.
