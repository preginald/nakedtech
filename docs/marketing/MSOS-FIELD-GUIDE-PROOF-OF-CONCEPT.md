# Naked Tech field guide — contractor presentation

Core #4305. Review-only prototype on branch `design/msos-field-guide-poc`, based on production `542a4d4`. Article: `/guides/slow-computer-fix-upgrade-replace/`. Peter will assemble the MSOS team and introduce the contractor; this document prepares that presentation without convening the team or implying its acceptance. Production remains unchanged.

## Design proposition

Give a household reader the confidence of a well-designed practical reference book. Brand v2.1 provides the Inter/system sans typography, charcoal/bone surfaces, peach accents, rounded cards, clear language and explicit service boundaries. The editorial system adds a consistent grammar for finding, understanding and acting on advice. It does not imitate another publisher's identity.

## Five-minute walkthrough

1. Open the article in light mode: the compact question/outcome title establishes purpose. The contents rail gives readers control over a long page.
2. Start here is a real choice of symptoms, not three numbered alternatives masquerading as instructions. Each card leads to useful guidance.
3. Show Fix / Upgrade / Replace: purposeful line illustrations, meaningful headings, concrete situations and an explicit question. No claim that the cards diagnose a fault.
4. Show Take care, Good to know, Try this and the checklist. Labels and icons identify meaning independently of colour. The checklist works with a keyboard and does not store or transmit entries.
5. Show local help: price, duration, inclusions, enquiry and exclusions have their own hierarchy. Confirm the same experience in dark mode and at phone width.

## Reusable parts / atomic structure

| Layer | Elements | Implementation |
|---|---|---|
| Foundations | Existing semantic brand colour tokens, type weights, spacing, borders, focus ring | Brand v2.1 + scoped `styles.css` |
| Atoms | Eyebrow label, decorative SVG icon, section number, checkbox, button | `.ed-label`, `icon()`, `.ed-button` |
| Molecules | Symptom link, decision alternative, note with labelled meaning | `choice()`, `decision()`, `note()` macros |
| Organisms | Symptom chooser, decision comparison, contents navigation, preparation checklist, service panel | Semantic sections composed in the article |
| Template | Chapter-like hero, desktop contents rail, bounded reading column, narrow-screen flow | `.ed-hero`, `.ed-layout`, `.ed-reading` |

Component macros are in `src/_includes/components/editorial/macros.njk`. `note()` accepts caller content; labels/headings remain visible without icons. Usage example:

```njk
{% from "components/editorial/macros.njk" import note %}
{% call note("care", "Take care", "Protect your original files") %}
<p>Article-specific, approved advice belongs here.</p>
{% endcall %}
```

Choices are navigation; decisions are alternatives; section numbers describe reading order. Do not use arbitrary icons or cards for every paragraph. Use a note only where its label genuinely helps. Service prices and limitations stay visible; never hide exclusions in a collapsed element. Macros escape ordinary text; caller markup is trusted repository-authored content.

## Content and scope

The introduction and H1 are edited for clarity; original SEO title/description remain. Existing comparison situations/questions, source link, cross-links and safety advice remain. Service presentation preserves $190 including GST, 60–75 minutes, locality, included work and excluded work; it adds no offer or promise. The service markup is an article-specific organism for now: do not generalise its commercial facts into global defaults.

## Reported styling discrepancy

Confirmed: the live `/css/styles.css` response has `max-age=2592000` (30 days), and HTML links to an unversioned URL. This permits new HTML to load with an old cached stylesheet and is consistent with Peter's screenshot; the exact contents of his browser cache were not inspected. A fresh browser showing correct styles is insufficient verification for returning visitors.

The prototype's small scoped stylesheet is included inline so its new components cannot mismatch their CSS through that cache. Production adoption should include a separate tested content-hash/versioned stylesheet strategy for the site, with a returning-browser regression check. No production cache fix is claimed in this prototype.

## Evidence and review boundary

Required `npm test`, desktop/mobile light/dark screenshots, 390/650/1440px layout checks, local anchors, meaningful links, keyboard checkbox and overflow checks. Evidence lives in decision-register `growth/evidence/MSOS-FIELD-GUIDE-POC-20260914/`. No enquiry was submitted. No exhaustive assistive-technology or conversion testing is claimed.

The team presentation should decide whether this editorial direction serves the reader, whether labels and illustrations clarify the content, and which components should become the shared standard. Rollout to the remaining articles follows that discussion; this branch is not a production release.


## MSOS-owned revision — educational continuation

Peter endorsed educational next steps first and a quieter optional help link. Athena commissioned Codex; Thalia authored the exact acceptance brief in Chat thread `187ec2ee-6dc1-41f2-8c9a-86c7f7afbdcb`, under #4305. This revision supersedes the original large service-panel demonstration above.

`nextReading(links, helpHref, helpLabel)` composes a What to read next section with topic-specific educational links and, optionally, one secondary local-help sentence. Supply the service label and destination explicitly; do not put pricing/package defaults into this component. Omit helpHref when no appropriate service link exists. Keep learning links primary, with a restrained text help link after them. No sales-card border, button, price or duration. The contents navigation now ends at What to read next.

Exact concluding copy: “If you’d rather have local help, see our computer support service.” Only “computer support service” links to the full service page, not directly to the form. That page retains price, inclusions and exclusions. Header/footer booking links remain; the claim is one in-article commercial link, not zero website CTAs. Production remains unchanged. Required site tests now protect this reader journey instead of requiring a price/form CTA in an educational article.


## Active contents and descriptive anchor refinement

At Peter's request, `data-editorial-contents` enables the reusable contents behaviour in `contents.js`. The last listed section reaching the reading line below the fixed header is current; the first item is the default before that point. Active state uses `aria-current="location"`, underline, weight and a rail marker. Passive scrolling is coalesced into animation frames. Scroll, resize, hash navigation, restored pages and article size changes recalculate location. It never moves keyboard focus, rewrites URLs or animates scrolling; ordinary anchors remain usable without JavaScript.

The optional link now reads **slow computer assessment**, replacing the broader computer support service label. Full sentence: “If you’d rather have local help, see our slow computer assessment.” The existing service destination and one-link limit remain. This supersedes the exact-label wording in the earlier revision brief, at Peter's request.

Google Search Central recommends descriptive, concise, contextually relevant anchor text and natural wording without keyword stuffing: https://developers.google.com/search/docs/crawling-indexing/links-crawlable . This improves destination clarity, with no claim of a measured ranking uplift. Production remains unchanged.


## Restrained interaction layer

Peter endorsed a consistent motion vocabulary: 160ms feedback, 2px lift on actionable symptom cards, 3px directional feedback on reading links, gentle checked-row tint and text-colour change, and a fading current-section marker. Keyboard focus receives equivalent feedback with a distinct focus ring. Pointer hover movement is limited to fine pointers that support hover; informational decision cards remain static. Scroll positions, focus and URLs are not animated or changed by this layer.

`example(title)` is a native details/summary disclosure for optional worked examples. The first instance supplies an explicitly illustrative symptom note, while all essential instructions and safety advice remain visible. Its chevron reflects expansion; opening content is immediate, without height animation or scroll manipulation. Native controls work without JavaScript.

Reduced-motion preference disables transitions and card/link translation while preserving colour, focus, checked and expanded states. No decorative entrance animations, automatic motion, timers, new dependencies, or tracking. Production remains unchanged.


## Decision-card examples

`decision(kind, title, situation, question, exampleText)` now optionally adds a native “See an example” disclosure. Each summary's accessible name includes its card title. Hypothetical Fix/Upgrade/Replace examples are conditional, not diagnoses or guarantees; core situations, questions and the surrounding safety callout remain visible. Cards independently expand, with no forced accordion behaviour. Card hover/focus-within changes only border and surface colour; no lift, arrow movement, click handler or pointer cursor on the card itself. The summary retains its native keyboard/touch control and reduced-motion behaviour. Existing essential content and service link remain unchanged; prototype only.


## First conceptual illustration

Peter endorsed a single branded illustration experiment for the symptom chooser. A generated triptych depicts startup waiting, application waiting and online waiting. `choice()` accepts an optional artwork identifier and displays the matching scene inside the existing actionable card. This is a first prototype-specific art mapping, not a global default for every future choice component. Labels, explanations and navigation remain native HTML; each framed scene has a short descriptive alt. One cached WebP supplies all three framed views; original and exact prompt are retained under docs/marketing/artwork. No fake software screenshot, text baked into the art, service change or production release.


## Dark-room illustration correction

Peter reported the pale artwork as uncomfortably bright in a dark bedroom. Added a separately generated dark edition with charcoal surfaces, soft warm-grey outlines and muted peach accents; no white document/screen panels. It preserves the three situations and framing. CSS selects the light/dark image using the same explicit site theme and system fallback as Brand v2.1. The artwork loading surface uses the current theme's surface token. Both small WebPs are loaded so switching is immediate; only the visible version contributes its alt text. The original light artwork remains for light mode. This supersedes the earlier deliberate-bone-in-both-themes note: visual legibility alone did not establish dark-room comfort. No claim of measuring a user's physical screen luminance.
