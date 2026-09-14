# Windows Move editorial-guide pilot

15 September 2026 · Core #4317 (selection #4316) · DOC-3511 v1.0

One new pillar `/guides/moving-to-a-new-windows-computer/` connects the existing preparation and handover satellites. Both satellites retain their reviewed content and add a return link. The pillar is registered in search metadata and sitemap; Pagefind indexes the generated page.

Apollo authored the draft in production Sanctum Chat; Thalia passed the corrected content in thread `e92be0c1-6e13-47a1-b56b-29480f4b691a`. Both had retrieved DOC-3511 v1.0 in that thread. Codex performed technical source checking and implementation. Post-editorial changes only add the existing paragraph and link classes; they do not change reviewed prose.

Sources checked 15 September 2026:
- https://support.microsoft.com/en-us/windows/experience/backup-recovery/back-up-and-restore-with-windows-backup — personal-account backup, selected folders/settings, application reinstallation limits.
- https://support.microsoft.com/en-us/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows — online-only files versus local availability.
- https://support.microsoft.com/en-us/windows/experience/backup-recovery/transfer-your-files-and-settings-to-a-new-windows-pc — withdrawal notice takes precedence over legacy instructions below it. Do not recommend the withdrawn feature.
- https://nakedtech.au/services/new-computer-setup-data-transfer-ivanhoe/ — existing service scope verified; article leaves prices and detailed terms on this page.

Artwork: approved `src/img/guides/computer-move-essentials-v1.webp`, with source/prompt in `docs/marketing/artwork/`. Three files/apps/accounts crops, meaningful alt text, existing 1.5:1 frames and 10px corners; no new generated assets.

Validation: npm test passed 5,221 site checks and 80 analytics scenarios / 393 assertions. Browser matrix covers three pages × two widths (390/1440) × two themes, image decoding/crops, no overflow, single service link, valid anchors, keyboard mobile contents and heading clearance. Reduced motion used; all three no-JavaScript fallbacks and internal destinations passed. Screenshots inspected for imagery, type, tables and consistent light/dark layout.

The pilot required engineering corrections: obsolete source recommendation, invalid social image path, duplicate heading ID, table labels, vague alt text and missing typography classes. This proves a supervised drafting → review → implementation workflow, not autonomous publication without engineering. Initial browser output overlapping a build was discarded; final audit includes a global-CSS-loaded check. The fixed sitemap count was updated from 35 to 36 for the new route.

Release authority: Peter approved the selected pilot and previously authorised article fixes/publication and continued deployment. No new social publication, outreach, customer action, spend or service commitment. Rollback is the previous website release `190022d7f8e92840874049565ad74871ca52b2c1`, with pre-release `_site` archive before deployment.

Exact receipts, review input hash, final screenshots, test output and production revision belong in decision-register `growth/evidence/MSOS-WINDOWS-MOVE-PILOT-20260915/` and Core #4317. This pack does not complete the remaining nine uncovered fixed-price services or demonstrate enquiries/revenue.
