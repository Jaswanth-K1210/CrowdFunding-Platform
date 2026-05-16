# TODO

## CampaignDetail UI redesign (Dashboard design system)
- [x] Inspect CampaignDetail.jsx and Dashboard.jsx for shared UI patterns (cards, badges, tables, gradients, spacing).
- [x] Create an edit plan for CampaignDetail.jsx: wrap sections into dashboard-style cards (bg-white rounded-2xl border shadow-sm, emerald/teal accents), reduce spacing.
- [ ] Redesign right donate sidebar into compact dashboard-like card with consistent button/input styles and hover transitions.
- [ ] Clean up progress representation using the same language as Dashboard’s MiniProgressBar (or equivalent markup) while keeping existing logic.
- [ ] Style donors list and documents list to look like dashboard cards/tables.
- [ ] Improve comments section container styling.
- [ ] Ensure mobile responsiveness: single column stacking, compact paddings, no oversized headings.
- [ ] Verify visual match with Dashboard card styles and shadows.
- [ ] Apply Tailwind class-only changes; do not modify functionality, state, handlers, API calls, imports, or useEffect logic.
- [x] Run frontend lint/build (if available) and verify page renders.


