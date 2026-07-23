# Naked Tech: Contact Page Replacement + Brand Identity Page

> **Planning & Design Document** — read this first, then implement.
> **For Hermes:** Load `plan` and `sanctum-forms-administration` skills before executing.

**Date:** 2026-07-23
**Status:** Draft — awaiting implementation

---

## 1. Goal

1. **Replace `/booking/` with `/contact/`** — a new Contact page featuring the dedicated Naked Tech landline number **03 7068 5422** (also displayed site-wide in the header/nav) and a Sanctum Forms embedded contact form.
2. **Create `/brand/`** — a Brand Identity page following the pattern established by the Digital Sanctum, Little Big Journeys, and Tania Ruddick Therapies brand pages. This serves as internal documentation for the Naked Tech visual identity.

---

## 2. Current State / Context

### Project Architecture
- **Static site generator:** Eleventy (11ty) v3 with Nunjucks templates
- **CSS:** Tailwind CSS v3 via PostCSS pipeline
- **Source:** `src/` → builds to `_site/`
- **Config:** `.eleventy.js` (passthrough for img, assets, robots.txt)
- **Data:** `src/_data/services.json` (4 services driven by pagination)
- **Audit:** `scripts/site-audit.mjs` checks routes, SEO, links, images

### Existing Pages
| Route | Source File | Purpose |
|-------|-----------|---------|
| `/` | `src/index.njk` | Homepage |
| `/services/` | `src/services.njk` | Service listing |
| `/services/{slug}/` | `src/service-detail.njk` | Per-service details (pagination) |
| `/booking/` | `src/booking.njk` | Google Calendar booking iframe |
| `/toolkit/` | `src/toolkit.njk` | Toolkit page |
| `/join/` | `src/join.njk` | Join the Team (Formspree form) |
| `/legal/` | `src/legal.njk` | House Rules |
| `/privacy/` | `src/privacy.njk` | Privacy Policy |
| `/thank-you/` | `src/thank-you.njk` | Post-form thank-you |
| `/sitemap.xml` | `src/sitemap.njk` | XML sitemap |

### Style Tokens (Tailwind)
| Token | Hex | Usage |
|-------|-----|-------|
| `skin-bone` | `#F7F4EF` | Primary background |
| `ivanhoe-slate` | `#2D3035` | Text, secondary surfaces |
| `electric-peach` | `#FF8C69` | Accents, buttons, CTAs |
| `electric-peach-ink` | `#B84424` | Accessible accent text on light surfaces |

### Navigation
- Fixed header: logo + SERVICES link + "GET NAKED" CTA (links to `/booking/`)
- Footer: Join the Team, The Toolkit, House Rules, Privacy Policy + Digital Sanctum attribution

### Reference Brand Pages
The three reference brand pages share a common structure:
1. **Hero section** — "Internal Documentation — [Direction/Label]" badge, h1 "Brand Identity", mission paragraph
2. **Numbered sections** with border-top separators, each led by a `text-[10px] uppercase tracking-[0.3em]` label in the brand accent color:
   - **01. Brand Positioning** — values, audience, voice
   - **02. Logo & Mark System** — mark, wordmark, lockups (horizontal + stacked), clearspace/minimum size rules, misuse examples
   - **03. Color Palette** — swatch grid with hex values and usage notes
   - **04. Typography** — font stack, scale, usage rules
   - **05. Imagery** — photo direction, treatment
   - **06. Applications** — real-world usage or component examples

---

## 3. Design Decisions

### 3.1 Contact Page Replacing Booking Page

**Why replace rather than add:** The existing `/booking/` page serves a single purpose (Google Calendar scheduling). The new Contact page supersedes it — it offers the phone number as the primary call-to-action and the embedded form as secondary. The Google Calendar iframe is out (it belongs in confirmation/booking flow, not the main contact page). We keep `/booking/` as a redirect to `/contact/` for backward compatibility with existing links in the wild.

**Phone number placement:**
- **Header/nav:** Add a small phone icon + `03 7068 5422` between the SERVICES link and the GET NAKED button. This makes the number visible on every page. On mobile, show icon-only with the number in the `aria-label`. The phone number links via `tel:+61370685422`.
- **Contact page:** Hero section features the number prominently as the primary CTA, with the embedded form below as "Or send us a message."

**Form strategy (Sanctum Forms):**
- Create a template via the Sanctum Forms browser console API (`/api/v1/templates`)
- Deploy a paused instance, then activate it once the page is ready
- Fields: `name` (text, required), `email` (email, required), `phone` (tel, optional), `message` (textarea, required), `service_interest` (select: "General enquiry", "The Full Strip — Mesh Wi-Fi", "The Bodyguard — Smart Security", "The Power Pose — Home Office", "The Quickie — Everyday Tech Support"), `preferred_contact` (radio: "Phone", "Email")
- Embed via `<iframe>` or the Sanctum Forms script embed snippet on the contact page
- Allowed origins: `https://nakedtech.au`
- Success redirect: `/thank-you/`

**Contact page layout:**
```
┌──────────────────────────────────────────────┐
│  Hero Section (dark bg: ivanhoe-slate)       │
│  ┌────────────────────────────────────────┐  │
│  │  h1: "Let's talk."                     │  │
│  │  p:  "Call or message us. We answer."  │  │
│  │  ┌──────────────────────────────┐      │  │
│  │  │  📞 03 7068 5422              │      │  │
│  │  │  (big, peach-colored number)  │      │  │
│  │  │  Mon-Fri 9am-5pm             │      │  │
│  │  └──────────────────────────────┘      │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  Form Section (light bg: skin-bone)          │
│  ┌────────────────────────────────────────┐  │
│  │  h2: "Or send us a message"            │  │
│  │  [Sanctum Forms Embedded Iframe]       │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  Info Cards Row                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Location │ │  Hours   │ │  ABN     │    │
│  │ Ivanhoe  │ │ M-F 9-5  │ │ 57 221   │    │
│  │ 3079 VIC │ │          │ │ 340 918  │    │
│  └──────────┘ └──────────┘ └──────────┘    │
└──────────────────────────────────────────────┘
```

### 3.2 Brand Identity Page

**Format:** Follow the reference pattern exactly — a long-scroll single page broken into numbered sections with the `text-[10px] uppercase tracking-[0.3em]` accent-colored section labels.

**Style:** Light background (`skin-bone`) with white content cards, consistent with the rest of the site. Each major section separated by `border-t border-ivanhoe-slate/10`. No dark-mode — this is a documentation page, not a marketing page.

**Sections:**

| # | Section | Content |
|---|---------|---------|
| 01 | Brand Positioning | Elevator pitch, brand values (transparent, bold, local), target audience (Ivanhoe/Eaglemont homeowners) |
| 02 | Logo & Mark System | The Naked Tech mark (rectangle+P path SVG), wordmark "NAKED TECH", lockup variations (horizontal nav version, stacked), clearspace rules, minimum size, misuse examples (don't stretch, recolor improperly, add effects) |
| 03 | Color Palette | 4-color swatch grid: skin-bone #F7F4EF (background), ivanhoe-slate #2D3035 (text/headings), electric-peach #FF8C69 (accent/CTA), electric-peach-ink #B84424 (accessible accent text). Include usage ratios and accessibility notes. |
| 04 | Typography | Inter (sans-serif) font stack, weights used (400, 500, 600, 700, 800), scale table from text-xs through text-7xl, tracking conventions |
| 05 | Brand Voice | Tone: cheeky but professional ("We turn things on"), transparency promise, the "naked" metaphor guidelines (playful but never sleazy), do's and don'ts |
| 06 | Imagery | Photo direction: sun-drenched, warm, residential Australian settings. Technician-presentation focus. Treatment: slight warmth boost, no heavy filters. |
| 07 | Components | Key UI patterns: the rounded-full CTA button, dark-section cards, the "window" wrapper (fake browser chrome), service cards, the footer attribution |

**Page structure (Nunjucks template):**
```
/src/brand.njk
├── Hero: "Internal Documentation — Brand v1" badge, "Brand Identity" h1, description paragraph
├── 01. Brand Positioning
├── 02. Logo & Mark System (with inline SVG examples in white cards)
├── 03. Color Palette (swatch grid)
├── 04. Typography (scale table)
├── 05. Brand Voice (do/don't table)
├── 06. Imagery (direction notes)
├── 07. Components (code-like representations of key UI patterns)
```

---

## 4. Implementation Tasks

### Phase A: Phone Number in Header/Nav

#### Task A1: Add phone number to base layout nav
**File:** `src/_includes/layouts/base.njk`
**Changes:**
- Between the SERVICES link and GET NAKED button, insert:
```html
<a href="tel:+61370685422" class="hidden md:inline-flex min-h-11 items-center gap-1.5 px-2 text-xs font-semibold text-ivanhoe-slate transition-colors hover:text-electric-peach" aria-label="Call Naked Tech on 03 7068 5422">
    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
    <span>03 7068 5422</span>
</a>
<!-- Mobile: icon only -->
<a href="tel:+61370685422" class="md:hidden inline-flex min-h-11 items-center px-2 text-ivanhoe-slate hover:text-electric-peach" aria-label="Call Naked Tech on 03 7068 5422">
    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
</a>
```
- Change the GET NAKED button href from `/booking/` to `/contact/`
- Change the button text from "GET NAKED" to "BOOK A VISIT" (more descriptive, less ambiguous for new visitors)

#### Task A2: Add phone number to footer
**File:** `src/_includes/layouts/base.njk`
**Changes:** Add a phone line in the footer, between the "Servicing Ivanhoe & Eaglemont" and the tagline:
```html
<p class="text-ivanhoe-slate font-bold">
    <a href="tel:+61370685422" class="hover:text-electric-peach transition-colors">03 7068 5422</a>
</p>
```

### Phase B: Contact Page (`/contact/`)

#### Task B1: Create contact page template
**File:** `src/contact.njk` (NEW)
This replaces the old `src/booking.njk`. The new file includes:
- YAML frontmatter: `layout: layouts/base.njk`, `title: Contact Naked Tech`, SEO description
- Dark hero section with:
  - h1: "Let's talk."
  - Subtitle: "Call or message us. We answer."
  - Prominent phone number display (large, electric-peach colored, with phone icon)
  - Hours note: "Monday–Friday, 9am–5pm"
- Light section with:
  - Heading: "Or send us a message"
  - Sanctum Forms embedded iframe/script
  - (Initially, use a placeholder `<div>` with a note — the form ID/slug gets wired in after Sanctum Forms deployment)
- Info cards row:
  - Location card: Ivanhoe 3079 VIC
  - Hours card: Mon-Fri 9am-5pm
  - ABN card: 57 221 340 918

#### Task B2: Update booking.njk to redirect
**File:** `src/booking.njk`
**Changes:** Replace content with a meta-refresh + manual link redirect to `/contact/`:
```html
---
layout: layouts/base.njk
title: Redirecting…
---
<div class="pt-40 pb-24 container mx-auto px-6 text-center max-w-2xl">
    <h1 class="text-4xl font-extrabold mb-4">We've moved.</h1>
    <p class="text-lg mb-6">Our booking page is now part of the new Contact page.</p>
    <a href="/contact/" class="inline-flex min-h-14 items-center rounded-full bg-electric-peach px-8 py-4 font-bold text-ivanhoe-slate shadow-lg hover:bg-[#FF7A50] transition-colors">Go to Contact Page</a>
    <meta http-equiv="refresh" content="0;url=/contact/">
</div>
```
(Note: Keep `/booking/` as a redirect rather than deleting it, because existing links, service CTA buttons, and Google may still point to it. The audit script also expects this route. We'll update the audit to expect the redirect content instead.)

#### Task B3: Update all internal references
**Files to update (search for `/booking/` references):**
- `src/index.njk` — (no direct booking link found, but service cards link to service pages which then link to booking)
- `src/service-detail.njk` — two CTAs link to `/booking/` (hero button + bottom CTA). Change both to `/contact/`
- `src/_includes/layouts/base.njk` — the GET NAKED → BOOK A VISIT button already changed in Task A1
- `src/services.njk` — check for any booking links

#### Task B4: Update sitemap
**File:** `src/sitemap.njk`
**Changes:** Replace `/booking/` with `/contact/`, add `/brand/`:
```njk
{% set routes = ["/", "/services/", "/contact/", "/toolkit/", "/join/", "/legal/", "/privacy/", "/brand/"] %}
```

#### Task B5: Update audit script
**File:** `scripts/site-audit.mjs`
**Changes:**
- In `expectedRoutes`: replace `/booking/` with `/contact/`, add `/brand/`
- Update the service detail checks to look for `href="/contact/"` instead of `href="/booking/"`
- Add a check that the phone number appears in the base layout:
  ```js
  const baseHtml = readFileSync(join(root, 'index.html'), 'utf8')
  assert(baseHtml.includes('03 7068 5422'), 'phone number present in header/nav')
  assert(baseHtml.includes('href="tel:+61370685422"'), 'phone number is tel: link')
  ```

#### Task B6: Update footer links
**File:** `src/_includes/layouts/base.njk`
**Changes:** The footer currently has no Contact link. Add one:
```html
<a href="/contact/" class="inline-flex min-h-11 items-center transition-colors hover:text-electric-peach hover:underline">
    Contact
</a>
```
Place it first in the footer links list.

### Phase C: Sanctum Forms Deployment

> **⚠️ This phase requires browser authentication.** The browser must be logged into `https://forms.digitalsanctum.com.au` with the Digital Sanctum SSO credentials (`peter@digitalsanctum.com.au` / `sovereign2025`).

#### Task C1: Create the "Naked Tech Contact" form template
**Method:** Browser console at `https://forms.digitalsanctum.com.au`
**Payload (template):**
```json
{
  "name": "Naked Tech Contact",
  "field_schema": [
    {"name": "name", "label": "Full Name", "type": "text", "required": true, "placeholder": "Your name"},
    {"name": "email", "label": "Email Address", "type": "email", "required": true, "placeholder": "you@example.com"},
    {"name": "phone", "label": "Phone Number", "type": "tel", "required": false, "placeholder": "04XX XXX XXX"},
    {"name": "service_interest", "label": "What can we help with?", "type": "select", "required": true, "options": [
      "General enquiry",
      "The Full Strip — Mesh Wi-Fi",
      "The Bodyguard — Smart Security",
      "The Power Pose — Home Office",
      "The Quickie — Everyday Tech Support"
    ]},
    {"name": "message", "label": "Tell us about your tech problem", "type": "textarea", "required": true, "placeholder": "What's going on? The more detail, the faster we can help."},
    {"name": "preferred_contact", "label": "Preferred contact method", "type": "radio", "required": true, "options": ["Phone", "Email"]}
  ],
  "settings": {
    "auth_mode": "public",
    "success_message": "Thanks! We'll get back to you within one business day.",
    "submit_label": "Send Message",
    "submit_width": "full",
    "submit_alignment": "left"
  },
  "notification_emails": ["peter@digitalsanctum.com.au"],
  "notify_template_id": "nakedtech-contact-notification"
}
```
**Execution:**
```js
(async () => {
const token = localStorage.getItem('sf_access_token');
const r = await fetch('/api/v1/templates', {
  method:'POST',
  headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
  body:JSON.stringify(/* payload above */)
});
const d = await r.json();
console.log('Template ID:', d.id);
})()
```
**Record the returned `id`** — needed for deployment.

#### Task C2: Deploy the form instance (paused)
**Method:** Browser console
**Payload:**
```json
{
  "name": "Naked Tech Contact Form",
  "slug": "nakedtech-contact",
  "project_id": "<core-project-uuid>",
  "allowed_origins": ["https://nakedtech.au", "http://localhost:8080"],
  "contact_invitations": [],
  "status": "paused"
}
```
**Execution:** POST to `/api/v1/templates/{template_id}/deploy`
**Record the returned `endpoint_id`** — this is the public form slug used in the iframe embed.

#### Task C3: Embed the form on the contact page
**File:** `src/contact.njk`
**Changes:** Replace the form placeholder div with the Sanctum Forms embed. The standard embed pattern:
```html
<iframe
    src="https://forms.digitalsanctum.com.au/f/nakedtech-contact"
    width="100%"
    height="800"
    frameborder="0"
    class="rounded-xl"
    title="Contact Naked Tech"
    loading="lazy">
</iframe>
```
**Note:** The iframe height may need adjustment once the form renders live. Start with 800px and test.

#### Task C4: Integration test
1. Activate the instance via browser console PATCH (`status: "active"`)
2. Submit a test entry via SSH on the sanctum server (to bypass origin restrictions):
   ```bash
   ssh sanctum-agent "curl -fsS -X POST http://127.0.0.1:8005/submit/nakedtech-contact \
     -H 'Content-Type: application/json' \
     -H 'Origin: https://nakedtech.au' \
     -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0400000000\",\"service_interest\":\"General enquiry\",\"message\":\"Integration test.\",\"preferred_contact\":\"Email\"}'"
   ```
3. Verify notification dispatch:
   ```bash
   ssh sanctum-agent "journalctl -u sanctum-forms.service --since '1 min ago' --no-pager -o cat | grep notify"
   ```
4. Pause the instance again after successful test
5. Activate it only after the page goes live

### Phase D: Brand Identity Page (`/brand/`)

#### Task D1: Create brand page template
**File:** `src/brand.njk` (NEW)
**Frontmatter:**
```yaml
---
layout: layouts/base.njk
title: Brand Identity
description: Visual identity and design standards for Naked Tech — Straightforward home technology support.
---
```

**Full page structure** — the template includes all 7 sections with real content derived from the existing site's visual language:

**Section 01 — Brand Positioning:**
- Badge: `Internal Documentation — Brand v1`
- Description paragraph defining Naked Tech's brand values
- Three-pillar values grid: Transparent, Bold, Local — each with icon + short description

**Section 02 — Logo & Mark System:**
- The existing SVG mark embedded inline
- "NAKED TECH" wordmark in its actual typography (Inter Bold, tracking-wide)
- Horizontal lockup (mark + wordmark, as used in nav)
- Clearspace rule: minimum padding equal to the height of the rectangle in the mark
- Minimum size: 40px tall for the mark alone
- Misuse examples as text descriptions (no stretched SVGs — use text descriptions)

**Section 03 — Color Palette:**
- 4-color grid with swatches rendered as colored divs:
  - `#F7F4EF` (skin-bone) — "Background. Warm off-white. The primary page surface."
  - `#2D3035` (ivanhoe-slate) — "Text & headings. Dark charcoal with subtle warmth."
  - `#FF8C69` (electric-peach) — "Accent. Coral-peach. CTAs, highlights, interactive elements."
  - `#B84424` (electric-peach-ink) — "Accessible accent. Terracotta. Accent text on light backgrounds."
- Each swatch: colored square + hex + Tailwind token name + usage description

**Section 04 — Typography:**
- Font stack: `Inter, ui-sans-serif, system-ui, sans-serif`
- Weight table: 400 (body), 500 (medium emphasis), 600 (semibold labels), 700 (bold subheads), 800 (extrabold headings)
- Scale examples: text-xs through text-7xl, showing rendered sample text at each size
- Tracking conventions: headings use `tracking-tight`, nav uses `tracking-wide`, labels use `tracking-widest`

**Section 05 — Brand Voice:**
- Tone principles: Cheeky but professional, transparent, never sleazy
- The "naked" metaphor rules
- Do's and Don'ts table with real examples from the existing copy

**Section 06 — Imagery:**
- Direction: Sun-drenched Australian residential interiors, technician-forward, warm color grading
- Existing hero image reference: `nakedtech_hero_technician.webp`
- Treatment notes: slight warmth, natural light, no heavy filters

**Section 07 — Components:**
- Rounded-full CTA button (the `bg-electric-peach rounded-full shadow-lg` pattern)
- Dark-section pattern (bg-ivanhoe-slate text-skin-bone)
- Service cards (white rounded-2xl border with icon, category label, title, description, link)
- Footer attribution (Digital Sanctum trading name)

### Phase E: Build, Test, Deploy

#### Task E1: Build and audit locally
```bash
npm run build
npm run test
```
Expected: build succeeds, all audit checks pass including new routes and phone number validation.

#### Task E2: Visual verification
Run `npm start` and visually inspect:
- `/contact/` — hero section, phone number, form iframe, info cards
- `/brand/` — all 7 sections render correctly, SVG mark displays, swatches show correct colors
- `/booking/` — redirect works
- Every page — phone number visible in nav, footer contact link present

#### Task E3: Deploy
```bash
git add -A
git commit -m "feat: add contact page, brand identity page, phone number site-wide"
git push
ssh sanctum-agent 'cd /mnt/sanctum-data/www/nakedtech && sudo -u preginald git pull && npm run build'
```

---

## 5. Files Summary

| File | Action | Description |
|------|--------|-------------|
| `src/_includes/layouts/base.njk` | MODIFY | Add phone to nav, update CTA button, add phone + contact link to footer |
| `src/contact.njk` | **CREATE** | New contact page with phone number hero + Sanctum Forms embed |
| `src/booking.njk` | MODIFY | Replace with redirect to `/contact/` |
| `src/brand.njk` | **CREATE** | Brand Identity page (7 sections) |
| `src/service-detail.njk` | MODIFY | Update booking links to contact |
| `src/sitemap.njk` | MODIFY | Replace `/booking/` with `/contact/`, add `/brand/` |
| `scripts/site-audit.mjs` | MODIFY | Update expected routes, add phone number checks |
| Sanctum Forms (browser) | CREATE | Template + paused instance for contact form |

---

## 6. Risks & Open Questions

1. **Sanctum Forms notify_template_id** — `nakedtech-contact-notification` may not exist in the Notify catalogue (`backend/app/notify_catalogue.py`). May need to create it first or use an existing template slug. **Mitigation:** Check the catalogue before creating the form template.

2. **Iframe height** — Sanctum Forms iframe height is unknown until the form renders live. **Mitigation:** Start with 800px, test, adjust.

3. **Booking redirect SEO** — `/booking/` becoming a redirect is fine for users, but search engines may take time to update. **Mitigation:** The `<meta http-equiv="refresh">` with `content="0"` is treated as a permanent redirect by Google.

4. **Core project UUID** — The Forms deployment requires a `project_id` from Sanctum Core. Need to identify or create the Naked Tech project in Core first. **Mitigation:** Check existing Core projects; if none exists for Naked Tech, create one via the Sanctum Chat Surgeon persona.

5. **GET NAKED button copy** — Changing "GET NAKED" to "BOOK A VISIT" is a brand copy decision. The user should approve this. **Clarification needed:** Should the CTA button text change, or should "GET NAKED" be preserved?

---

## 7. Open Question for the User

The current CTA button in the nav says "GET NAKED" — cheeky and on-brand but potentially confusing for first-time visitors who don't know the brand. Should I:

- **A)** Change it to "BOOK A VISIT" (clear, direct, but loses the brand voice)
- **B)** Keep "GET NAKED" (on-brand, distinctive, but less obvious what it does)
- **C)** Something else? (e.g., "GET NAKED →" or "BOOK NOW")
