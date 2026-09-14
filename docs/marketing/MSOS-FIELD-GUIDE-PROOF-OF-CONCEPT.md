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
