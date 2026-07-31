# Repository Guidelines

## Project Structure & Module Organization

This repository builds the Naked Tech static website with Eleventy and Nunjucks. Page templates live in `src/*.njk`; campaign-specific pages are under `src/landing-pages/`. Reusable layouts and components belong in `src/_includes/`, while shared content is stored as JSON in `src/_data/`. Tailwind input is `src/css/styles.css`, and public images and static files live beneath `src/img/` and `src/assets/`.

Eleventy writes the generated site to `_site/`; treat that directory as build output rather than source. Validation utilities are in `scripts/`. Marketing plans, creative assets, and campaign evidence are organized under `docs/marketing/`.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions from `package-lock.json`.
- `npm start` runs the Eleventy development server and Tailwind watcher in parallel.
- `npm run build` produces a clean, minified site in `_site/`.
- `npm test` builds the site, runs structural and metadata checks, then validates analytics coverage.
- `npm run audit:analytics` runs only the analytics matrix check.

Run `npm test` before submitting changes that affect templates, routes, metadata, forms, or tracking.

## Coding Style & Naming Conventions

Follow the existing two-space indentation in JavaScript, Nunjucks, JSON, and Tailwind configuration. Use single quotes in JavaScript and trailing commas where surrounding code does. Keep templates focused: extract shared markup into `src/_includes/components/` or layouts, and place reusable site values in `src/_data/`.

Use lowercase kebab-case for page and asset names, such as `slow-computer-help.njk` or `services-hero.webp`. Prefer Tailwind utility classes; add custom CSS only for shared behavior or accessibility needs. No automatic formatter is configured, so match nearby style.

## Testing Guidelines

Tests are custom Node.js audits rather than a unit-test framework. `scripts/site-audit.mjs` checks generated routes, metadata, structured data, landing-page contracts, and form integration. When adding a public route or changing an audited contract, update its expectations in the audit scripts. A successful `npm test` is the baseline requirement; manually inspect responsive visual changes through `npm start`.

## Commit & Pull Request Guidelines

History follows Conventional Commits, commonly `feat:`, `feat(marketing):`, and `docs(marketing):`. Write imperative, scoped subjects, for example `fix(landing-page): correct booking CTA`.

Pull requests should summarize the user-visible change, list validation performed, and link the relevant issue or marketing plan. Include before/after screenshots for layout or creative changes, and call out analytics, SEO, route, or configuration impacts explicitly.
