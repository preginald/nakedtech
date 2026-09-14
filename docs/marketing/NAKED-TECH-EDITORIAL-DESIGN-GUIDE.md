# Naked Tech Editorial & Design Guide

Version 1.0 · 15 September 2026 · MSOS / Core #4314

This is the current standard for Naked Tech pillar and satellite articles. It consolidates Peter’s accepted twelve-article design and the education-first refinements. It supersedes conflicting examples in the historical proof-of-concept log. Brand v2.1 (`src/brand.njk`) remains authoritative for brand identity. This guide governs editorial execution, not service terms or publication authority.

## Purpose and voice

Help a reader understand a problem, make safe observations and choose a sensible next step—even if they never buy from us. Earn trust by being useful. Write for local households with varied technical confidence; do not assume a job title, age or technical skill. Use Australian English and “Naked Tech”.

Use plain, direct sentences, concrete examples and descriptive headings. Address the reader as “you”; use “we” for an actual Naked Tech practice supported by evidence. Explain an unfamiliar term where it first matters. Prefer short paragraphs with one point, lists for steps and tables for genuine comparisons. There is no word quota: finish the reader’s question without padding or duplicating other articles.

Brand personality can be warm and lightly playful in everyday situations. Practical clarity leads in educational guidance. For scams, security, money, lost files or urgent situations, be calm, factual and non-judgemental; jokes stop. Never shame the reader or imply they caused a problem through stupidity. The practical-reference-book influence concerns clarity and navigation, not imitating another publisher’s name, illustrations or tone.

| Avoid | Prefer |
|---|---|
| “Your computer is ancient. Time to upgrade.” | “Notice when the delay happens before deciding what to change.” |
| “This proves your router is faulty.” | “This comparison may help identify what to investigate next.” |
| “Unlock blazing-fast performance today!” | “Record what was open and what felt slow.” |
| “Contact us to find out the solution.” | Explain the useful observations in the article; offer optional local help afterward. |

Separate observation, possible explanation and confirmed diagnosis. Label invented examples as examples. Do not invent tests performed, technician experience, customer quotes, screenshots, guarantees, service coverage or research. Cite the primary source beside technical advice and record its checked date in the private handoff. Recheck time-sensitive software instructions before publication. Changing a reviewed claim requires a focused review of that change, not a new council for the whole article.

## Pillar and satellite structure

| Element | Pillar | Satellite |
|---|---|---|
| Reader job | Understand a broad problem and choose the next path | Answer one specific question or complete one bounded observation |
| Opening | Outcome-led title, useful summary, boundaries | Direct answer or purpose, connection to the broader problem |
| Start here | Three meaningful routes/symptoms | Three useful entry points, observations or preparation areas |
| Body | Explain the problem, compare paths, give practical first steps | Focused procedure/comparison, interpretation and limits |
| Examples | A few representative situations | One relevant example if it aids understanding |
| Links | Introduce relevant satellites where readers need detail | Link to the appropriate pillar and relevant siblings |
| Ending | Educational next steps and optional local help | What the result means, what remains unknown and what to read next |

Use the templates in `docs/marketing/templates/`. They are intentionally incomplete, non-published scaffolds stored outside `src/`. Replace every `REPLACE_` token, write the actual advice and select relevant artwork before copying to `src/guides/`. Do not publish filler or create three arbitrary cards just to fit a template: if the three-route structure is genuinely unsuitable, propose one documented design-system revision before using a different layout.

Do not split one answer into thin pages merely to create satellites. Reuse and improve existing relevant content first. Titles, summaries and headings must match the article, not a keyword quota. Preserve an existing URL when improving its article. Add new routes to the site’s existing search/discovery/sitemap data where required; verify the emitted output. Use descriptive, natural link labels such as “Wi-Fi dropout diagnosis” or “prepare for a new computer”, not “click here”, internal labels such as “pillar”, or repeated location-heavy keywords. Never link to a planned page as if it were live.

## Reusable design system

Use the existing semantic brand tokens and shared `components/editorial/styles.css`, `macros.njk` and `contents.js`. Do not copy their implementation into individual articles or add a competing card/colour system. Inter/system sans, bounded reading width, warm bone/charcoal surfaces and restrained peach accents are inherited from the site. Keep spacing and typography in the shared kit.

| Component | Use |
|---|---|
| `choice()` | Three navigational cards in Start here; meaningful title, description and target. Supply a suitable action label. |
| `decision()` | Genuine alternatives, an explicit question and optional example; not a diagnosis. |
| `note()` | Visible Take care, Good to know or Try this information. Essential safety remains expanded. |
| `example()` | Optional extra explanation; not essential advice or exclusions. |
| `contents()` | Links to real section IDs; desktop active rail and mobile sticky, square-edged row below the site header. |
| `nextReading()` | Educational reading links first, then at most one quiet optional service link. |

Sections use unique stable descriptive IDs, visible headings and decorative section numbers. Card links are navigation, not fake buttons. Tables use proper headers and `data-label` values for the mobile labelled-card treatment. Put long comparisons in the existing accessible region/overflow wrapper. Native disclosures and controls must remain keyboard-operable. Preserve focus visibility, heading clearance under sticky navigation, no-JavaScript links and reduced-motion behaviour. Motion should clarify hover/focus feedback; avoid autoplay, bouncing elements and decorative distractions.

## Images and diagrams

Every article needs useful explanatory visual coverage inside the article. A logo, small icon, table or social-preview image alone does not satisfy this. Default: three illustrations within the shared Start here cards, with the existing **1.5:1 frame ratio, 10px image corners, spacing and cropping**. Do not add oversized standalone section images just to meet an image quota. A separate diagram is appropriate only when it explains something the cards cannot.

Reuse approved artwork where its meaning fits. Computer startup/app/online scenes suit performance observations; device/room/task scenes suit Wi-Fi; files/applications/accounts suit migration. Do not use a slowdown image to stand for account recovery merely because it is available. A triptych must be composed for the three crops; arbitrary photos need an appropriate component change, not blind reuse of the triptych crop rules.

AI illustrations are conceptual, never fabricated evidence of an actual software screen, test result or customer. Retain the prompt and source in `docs/marketing/artwork/`; publish an optimised asset under `src/img/guides/`. Give informative images meaningful alt text; mark purely decorative additions appropriately. Reserve dimensions, verify decoding and crops, and optimise file size. Keep dark mode comfortable in a dark room: no large white panels, bright glow or neon. An intentionally dark asset may serve both themes if inspected and legible; a separate light variant is not mandatory.

## Educational content and commercial boundaries

Answer the question openly. Do not pepper the body with booking buttons, prices, discounts, service packages or sales panels. Link to relevant educational pages before offering help. The article may end with **one optional, restrained service link**, with a useful anchor label and no invented price, promise or availability. Zero service links is acceptable when none is relevant. Global header/footer navigation is separate from this in-article limit. Full offer scope, terms, price and exclusions belong on the current service page.

Do not turn a pattern into a diagnosis, recommend irreversible actions as casual first steps, or collect passwords/recovery codes in article exercises. Keep relevant safety advice visible and proportionate. Tool descriptions must explain what the tool does, how to use it for the bounded task and what its results cannot establish. Do not claim Naked Tech uses a tool unless that practice is verified.

## MSOS handoff and review

The drafting assistant reads this guide and only the relevant template, live reference and source packet. It returns the article, source references/check dates, pillar/satellite links, artwork choice/alt text and unresolved facts. It records **guide version 1.0** and the owning Core ticket. Do not reload the full programme history or convene a council for routine drafting.

The editorial assistant checks usefulness, voice, scope, sources, interpretation limits, imagery relevance and restrained commercial treatment. It returns an explicit pass or a short actionable change list against the actual draft. Routine private drafts, edits and editorial reviews are team work and need no new Peter approval. Engineering implements the shared components and runs technical checks. A failed check returns to its owner; do not increase model budgets or endlessly repeat reviews to obtain a pass.

The publication handoff records the exact revision, guide version, editorial verdict, sources, image provenance, tests, screenshots, destination routes and applicable existing release authority. Existing approved authority governs release; this document creates no new outreach, spending or commercial authority. Editorial approval is not permission for an otherwise unauthorised public action.

## Acceptance before publication

- Editorial verdict covers the final content and changed claims; no placeholders or unsupported facts remain.
- Required `npm test` passes. The guide audit automatically discovers future generated article routes, checks the shared structure, illustrated cards, assets/alt text, navigation targets, restrained service links and unresolved template tokens. It cannot judge voice or truth.
- Inspect mobile and desktop in light/dark mode. Check image crops/loading, typography, labelled tables, overflow, active contents, sticky heading clearance, keyboard focus, reduced motion and no-JS access. Save representative screenshots and findings. Automated checks are not visual approval.
- Verify canonical URL, sitemap/search discovery, incoming links from relevant existing pages and outgoing destinations. Preserve consent/analytics behaviour; do not submit a customer form as a routine article check.
- After an authorised release, verify live revision, page/asset responses and the rendered result. Retain rollback to the previous release. Record evidence on the owning Core ticket through Sanctum Chat.

Reference examples: `src/guides/slow-computer-fix-upgrade-replace.njk` (pillar), `src/guides/wifi-dropouts-diagnosis.njk` (pillar), `src/guides/wifi-dropout-diary.njk` (satellite), and `src/guides/new-windows-computer-move-checklist.njk` (migration satellite). Their technical advice is not a substitute for current source checking when reused.
