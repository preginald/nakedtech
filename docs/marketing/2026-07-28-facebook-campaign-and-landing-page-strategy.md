# Naked Tech Facebook Campaign and Pain-Point Landing Page Strategy

**Date:** 28 July 2026<br>
**Status:** Approved strategic direction<br>
**Website:** https://nakedtech.au<br>
**Canonical project plan:** `.hermes/plans/2026-07-28_123314-naked-tech-pain-point-landing-pages.md`

---

## Executive conclusion

The current Facebook campaign has not produced enough data to prove that the advertisement or website has failed. It has, however, exposed a structural weakness in the sales journey:

> The advertisement starts with a specific Wi-Fi pain, dilutes that message with a catalogue of unrelated services, and then abandons it on a generic contact page.

Naked Tech should rebuild the successful intent architecture Peter used with Your PC Matters in a modern, local form:

1. Create landing pages around recognisable customer problems rather than internal service categories.
2. Continue the exact advertisement promise above the fold on the destination page.
3. Use Facebook first for persistent problems that a broad local audience can recognise, such as unreliable Wi-Fi and chronically slow computers.
4. Use local SEO, Google Business Profile and eventually Google Search for sudden, low-incidence failures such as a broken screen or a laptop that will not start.
5. Test no more than two paid concepts at once while the budget and audience remain small.

The first two landing pages should be:

- Wi-Fi dropouts and dead zones in Ivanhoe and Eaglemont
- Slow computers and Windows 10/11 decision support in Ivanhoe and Eaglemont

---

## 1. Campaign export findings

The supplied Meta Ads export contains one campaign-level record:

| Metric | Result |
|---|---:|
| Spend | **$18.84** |
| Impressions | **2,163** |
| Reach | **592 people** |
| Frequency | **3.65** |
| CPM | **$8.71** |
| Reported results | None |
| Delivery | Inactive |

At a nominal budget of $5 per day, the spend represents approximately 3.8 days of delivery. About $81.16 of the $100 cap remained unspent at the time of export.

### What is encouraging

- An $8.71 CPM is inexpensive local reach.
- Meta is capable of delivering the campaign to the target area.

### What is concerning

- The same 592 people saw the advertisement an average of 3.65 times within a short period.
- The export does not contain click or landing-page data, so it cannot distinguish among creative, traffic, page-load, conversion and tracking failures.
- A `Call Now` proposition that opens a generic web page adds a step rather than initiating the expected action.
- If call-led advertisements run outside the published Monday–Friday, 9am–5pm hours, the campaign promise and response experience can diverge.

### Why zero leads is not yet statistically meaningful

If a landing page has a true 5% conversion rate:

- after 10 clicks, the probability of zero leads is still approximately 60%;
- approximately 45 clicks are needed for a 90% probability of observing at least one lead.

A few clicks and no leads is therefore normal. The next export must include ad-level funnel metrics before performance is judged.

### Required next export

Export at **Ads level**, including:

- Amount spent
- Impressions
- Reach
- Frequency
- CPM
- Link clicks
- Outbound clicks
- Landing-page views
- Link CTR
- Link CPC
- Pixel `Contact`
- Pixel `Lead`
- Cost per result
- Placement
- Age
- Day/time breakdown

---

## 2. Current message-match diagnosis

The current advertisement headline is specific:

> **Your Wi-Fi shouldn’t drop out in the bedroom.**

The rest of the journey is not:

1. The primary text broadens from Wi-Fi to smart security, home offices and general support.
2. The CTA opens `/contact/`.
3. The contact page no longer mentions Wi-Fi.
4. The visitor is asked to call or submit a form before seeing the likely causes, diagnostic process, starting price, proof or expected outcome.

The contact page provides a conversion mechanism, but it does not perform the persuasion required for cold paid-social traffic.

The existing `/services/full-strip/` page is much closer to the required destination because it continues the Wi-Fi problem, explains symptoms, shows a process and exposes pricing. Its weakness is that it moves quickly to a $900–$1,800 whole-home Mesh Wi-Fi installation. Someone experiencing one unreliable room may believe they are being sold a large installation before the underlying fault is diagnosed.

The entry offer should therefore be diagnostic-first:

> **Wi-Fi keeps dropping out? We will determine whether the cause is the NBN service, router, placement, interference or coverage before recommending new hardware.**

Approved final price framing (owner decision recorded 28 July 2026):

> **$190 fixed-price Wi-Fi Dropout Diagnosis. No call-out fee in Ivanhoe or Eaglemont. Mesh only if the diagnosis shows it is needed.**

Naked Tech's business-wide pricing policy is per project rather than hourly. The release therefore normalises legacy hourly, minimum-charge and time-block wording on the existing service pages to fixed-scope project language.

---

## 3. Immediate conversion blocker: character encoding

The live website visibly renders UTF-8 punctuation incorrectly in a browser. Examples observed include:

- `$900â€“$1,800`
- `No ticket numbers â€” just a real person`
- `Ivanhoe Â· Whole-home Mesh Wi-Fi`

Root cause:

- Meta Pixel and GA scripts appear before the charset declaration in `src/_includes/layouts/base.njk`.
- `<meta charset="UTF-8">` is currently at line 33.
- In the deployed response the declaration begins at byte 1,218, outside the first 1,024 bytes used for reliable HTML encoding sniffing.
- The HTTP `Content-Type` response does not declare a charset.

The charset declaration should be the first element after `<head>`, and the deployed server should ideally return `Content-Type: text/html; charset=utf-8`.

No paid campaign should be reactivated until the generated pages have been checked for mojibake in a real browser.

---

## 4. Your PC Matters archival crawl

A complete crawl of the archived public website was performed against the 25 January 2014 target snapshot:

- 396 Wayback CDX HTML inventory records examined
- 47 non-content Joomla utility/email/system endpoints excluded
- print variants normalised
- 326 canonical public pages attempted
- 326 pages retrieved successfully with HTTP 200

### Public content inventory

| Content type | Pages |
|---|---:|
| Blog article URL paths | 150 |
| Blog tag pages | 119 |
| National service/offer pages | 21 |
| Blog category pages | 15 |
| Location landing pages | 9 |
| Other public pages | 4 |
| Legal/trust pages | 4 |
| Blog author pages | 3 |
| Homepage | 1 |

The 150 article paths represented approximately 93 distinct titled articles, with duplication caused by Joomla category and routing patterns.

### What made the old pages persuasive

The strongest laptop, workshop, virus and remote-support pages consistently answered five buyer questions:

1. Can this business solve my exact problem?
2. How much will it cost?
3. How quickly can it be handled?
4. Can I trust the technician with my home, device and data?
5. What happens after I make contact?

The pages used:

- exact problem-specific titles and H1s;
- concrete price and turnaround anchors;
- recognisable symptom lists;
- a clear step-by-step process;
- parts, warranty and satisfaction information;
- testimonials and repeated trust signals;
- a visible telephone number;
- and a form on the same page.

The key lesson is not simply “create more pages.” The old site created a complete **intent and uncertainty-reduction architecture** before asking for the enquiry.

### What should not be copied

- Large numbers of thin tag pages
- Near-duplicate geographic doorway pages
- National collection or workshop promises that Naked Tech does not currently deliver
- Obsolete 2014 prices and turnaround guarantees
- Fear-heavy or overly aggressive copy
- Component-level repair pages without a profitable workshop and parts model
- “Virus removal” language that ignores modern scam, account, browser and identity risks

The current implementation should preserve specificity, certainty and trust while replacing the outdated SEO and sales tactics.

---

## 5. Current pain-point opportunities

Current Australian search-language signals include:

- computer or laptop running slowly;
- laptop not turning on or showing a black screen;
- Wi-Fi disconnecting, dropping out or cutting out;
- printer not printing or connecting;
- email not syncing, receiving or sending;
- virus removal near me;
- “I think I have been scammed”;
- Windows 10 end of support;
- new computer setup and data transfer.

Autocomplete is a qualitative intent signal, not a search-volume estimate.

### Current external signals

- Microsoft confirms that Windows 10 support ended on 14 October 2025, creating a current need for upgrade, replacement and data-migration advice.
- Scamwatch’s live 2026 dashboard, accessed on 28 July 2026, showed 91,768 reports and $156.58 million in reported losses, including substantial online, phishing and account-takeover losses.
- The ACCC’s March 2026 broadband performance material notes that older networking equipment can constrain higher-speed connections, supporting a service that separates NBN performance from in-home Wi-Fi faults.

### Priority matrix

| Pain point | Meta fit | Google/SEO fit | Recommendation |
|---|---:|---:|---|
| Wi-Fi dead zones and dropouts | **High** | High | Build and test first |
| Slow Windows PC / Windows 10 uncertainty | **High** | **High** | Build and test second |
| Scam, suspicious pop-ups or account compromise | Medium | **High** | Build third; use calm, trust-heavy messaging |
| New computer setup and data transfer | Medium | **High** | Phase two |
| Printer and email problems | Low–medium | High | Organic/search page; not the first paid campaign |
| Broken screen, charging fault, laptop not starting | Low | **Very high** | Search/SEO only unless a workshop service returns |

---

## 6. Facebook versus search intent

The old Your PC Matters pages succeeded primarily because Google delivered people who were already experiencing the problem.

Someone whose laptop screen breaks today will search for a repairer. Facebook cannot reliably know which local resident has a broken screen at the moment an impression appears, so most impressions would be irrelevant.

Facebook is better suited to persistent, recognisable frustrations:

- unreliable Wi-Fi in part of the home;
- a computer that has been slow for months;
- uncertainty about Windows 10 and Windows 11;
- a home-office setup that remains awkward.

Therefore:

- build problem pages for SEO and conversion regardless of paid traffic;
- use Meta initially for persistent pains that can self-select a broad audience;
- use Google Business Profile, organic search and later tightly targeted Google Search ads for urgent failures.

---

## 7. Initial landing-page roadmap

### Page 1: Wi-Fi dropouts and dead zones

Approved route: `/services/wifi-dropouts-ivanhoe/`

Core promise:

- Diagnose before selling hardware
- Separate NBN speed, router, placement, interference and coverage causes
- Use Mesh only when the diagnosis supports it
- Expose the approved $190 fixed-price diagnosis and local call-out policy

### Page 2: Slow computer and Windows support

Approved route: `/services/slow-computer-help-ivanhoe/`

Core promise:

- Diagnose storage, software, malware, update and age-related causes
- Assess Windows 11 compatibility and Windows 10 risk
- Explain whether repair, upgrade or replacement is economically sensible
- Offer data transfer and setup when replacement is the better option

A separate `/windows-10-upgrade-help-ivanhoe/` page should be considered only if research and campaign data support distinct intent.

#### P3-T1 page-split decision — 28 July 2026

Use one `/services/slow-computer-help-ivanhoe/` page with a substantive Windows lifecycle section rather than two pages.

- “Slow computer” and “Windows 10 support ended” are different entry triggers but converge on one commercial journey: assess device condition and Windows 11 compatibility, then decide among repair, upgrade, an interim supported path, or replacement with data transfer/setup.
- AU Google/Bing autocomplete showed symptom/fix/service language around slow computers and mainly informational “what now,” “should I upgrade” and compatibility-check language around Windows. The exact `windows 10 upgrade help melbourne` seed returned no Google suggestions. This is qualitative query-language evidence, not proof of search volume or absence of demand.
- The available Meta export contains campaign-level Wi-Fi delivery only and no ad-, click- or landing-page-level evidence for either slow computers or Windows. It cannot justify a separate Windows conversion path.
- Microsoft’s current end-of-support guidance itself presents compatibility checking, Windows 11 upgrade, Extended Security Updates and replacement as one options workflow.
- A later split requires both material Windows-specific query/ad evidence and an owner-approved distinct offer and CTA. A second page should not be created merely because the informational vocabulary differs.

#### P3-T2/P3-T3 implementation record — 29 July 2026

The combined page is implemented at `/services/slow-computer-help-ivanhoe/` through the unchanged shared sales-landing-page template.

- Approved offer: `From $190` fixed-price diagnosis and decision project, with exact scope and price agreed before work starts.
- Included: diagnosis, safe straightforward fixes within the agreed scope, Windows lifecycle assessment, and a plain-English repair/upgrade/replace recommendation.
- Separate work: parts, account recovery, provider work, data transfer/new-computer setup and follow-up. The page explicitly states that not every fault can be completed in one visit.
- The page covers slow startup, freezing, storage/update/background software, security indicators, device condition, Windows 11 compatibility and Windows 10 support options without implying malware or forced replacement.
- The route is in the sitemap and automated landing-page audit, has an internal link from The Quickie, and uses a unique 1200×630 problem-specific Open Graph image.
- Verification passed 530 automated checks across 17 generated pages plus build, desktop/tablet/mobile review at 360/390/768/1280, zero measured horizontal overflow, valid Service JSON-LD, and `slow_computer` page-view/telephone/form context.
- No separate Windows page, copied layout or page-specific template branch was introduced.

#### Final route architecture — 29 July 2026

- Both pain pages live beneath the existing `/services/` hierarchy because they are durable commercial service pages, even though they retain a distinct conversion-focused template and problem-first copy.
- Final canonical routes are `/services/wifi-dropouts-ivanhoe/` and `/services/slow-computer-help-ivanhoe/`.
- The `-ivanhoe` location remains because Naked Tech serves only Ivanhoe and Eaglemont for the foreseeable future; it improves local message match and discourages out-of-area enquiries.
- Eaglemont is represented in titles, descriptions, visible copy, offer boundaries and `areaServed`; it does not receive a cloned suburb page.
- Do not create additional suburb variants without a genuine operating-area change and materially distinct local value. This avoids a duplicated service-by-suburb doorway-page matrix.

### Page 3: Scam and computer-security help

Suggested route: `/scam-virus-help-ivanhoe/`

Core promise:

- Calm, non-judgemental triage
- Immediate bank, Scamwatch and ReportCyber guidance where appropriate
- Device inspection and account-security support
- Clear boundaries: no promise to recover stolen funds
- Avoid fear-heavy copy and avoid implying knowledge of a viewer’s private condition

### Later organic/search pages

- New computer setup and data transfer
- Printer and email support
- Laptop will not start / black-screen triage
- Screen, charging and physical repairs only if an operational workshop model is approved

---

## 8. Modern landing-page conversion structure

Every problem-specific page should use a shared Nunjucks sales-landing-page template with:

1. Exact pain in the H1
2. Ivanhoe/Eaglemont relevance above the fold
3. Clear diagnosis or starting offer
4. Primary phone CTA and secondary enquiry CTA
5. Recognisable symptoms
6. What is diagnosed, fixed or configured
7. A simple three-step process
8. Transparent price and exclusions
9. Trust and proof
10. Problem-specific FAQs
11. Inline or pre-contextualised enquiry form
12. Final CTA repeating the original promise

Potential trust material includes:

- Peter’s home-computer support experience since 2004, if presented with accurate continuity wording;
- current Google reviews rather than unverified historical testimonials;
- local identity and service boundary;
- no hardware markup;
- clear handling of passwords and personal data;
- what happens when a fault cannot be completed in one visit.

The Naked Tech tone can remain distinctive, but severe scam and security scenarios require calmer language than the cheekier service names.

---

## 9. Initial paid experiment

Do not split the remaining budget across many ad sets.

Use one local ad set and two concepts:

- **Concept A:** Wi-Fi dropouts → Wi-Fi diagnostic landing page
- **Concept B:** Slow PC / Windows 10 → slow-computer landing page

Allocate approximately $40 to each concept through a controlled A/B test or sequential fixed-spend tests.

### CTA choice

- Use `Learn More` when the landing page must explain the problem and offer.
- Use `Call Now` only when it initiates a call directly and the ad runs while someone can answer.
- Maintain a form/message route outside business hours.

### Attribution

Every advertisement should use unique UTM parameters. Track:

- landing-page view;
- telephone click;
- form start;
- successful form submission;
- page/problem identifier;
- actual completed calls through call tracking if needed.

A telephone-link click is a micro-conversion, not proof of a completed call.

---

## 10. Recommended execution order

1. Fix and test the UTF-8 rendering defect.
2. Establish the landing-page data contract and reusable Nunjucks template.
3. Build the Wi-Fi diagnostic page as the pilot implementation.
4. Review its message, design and mobile conversion path before cloning the pattern.
5. Build the slow-computer/Windows page.
6. Verify analytics and form attribution end to end.
7. Create only two matching Meta concepts.
8. Run the controlled low-budget experiment.
9. Analyse ad-level funnel data before building additional paid campaigns.
10. Expand the organic/search landing-page library based on operational fit and demonstrated intent.

---

## Sources and project evidence

- Meta export: `/home/preginald/Downloads/Naked-Tech-Ads-Campaigns-28-Jun-2026-27-Jul-2026.csv`
- Archived site: https://web.archive.org/web/20140125191948/http://www.yourpcmatters.com/
- Microsoft Windows 10 support status: https://support.microsoft.com/en-au/windows/windows-10-support-has-ended-on-october-14-2025-2ca8b313-1946-43d3-b55c-2b95b107f281
- Google Search autocomplete (`gl=au`) and Bing autosuggest (`market=en-AU`), queried 28 July 2026 for slow-computer, Windows-end-of-support, compatibility and local-upgrade seed phrases
- Scamwatch statistics: https://www.scamwatch.gov.au/research-and-resources/scam-statistics
- ACCC broadband performance data: https://www.accc.gov.au/consumers/telecommunications-and-internet/broadband-performance-data
- Current contact implementation: `src/contact.njk`
- Current service-page implementation: `src/service-detail.njk`
- Current service data: `src/_data/services.json`
- Base metadata/tracking layout: `src/_includes/layouts/base.njk`
