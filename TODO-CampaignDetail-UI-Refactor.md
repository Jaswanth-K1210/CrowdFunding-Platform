# CampaignDetail UI Refactor (Dashboard Consistency)

## Step 1 — Identify Dashboard style primitives
- Extract/replicate styling patterns from `frontend/src/pages/Dashboard.jsx`:
  - cards: `bg-white rounded-2xl border shadow-sm`, hover `hover:shadow-md transition-all duration-300`
  - gradients: emerald/teal (e.g., `from-emerald-500 to-teal-600`)
  - section headers: icon + `text-gray-800 font-black` hierarchy
  - dashboard status badge patterns
  - mini progress bar style

## Step 2 — Redesign CampaignDetail layout skeleton (UI-only)
- Replace outer layout whitespace with Dashboard-like container:
  - `bg-gray-50 min-h-screen`, `max-w-6xl mx-auto`, consistent spacing
- Keep same component order and functionality.

## Step 3 — Hero card redesign (UI-only)
- Convert existing header card into dashboard-style hero:
  - cover image/banner at top (using existing `campaign.images` + existing ImageGallery untouched)
  - overlay gradient
  - status badge + category chip
  - creator avatar/initial
  - compact stats row

## Step 4 — Stats section (UI-only)
- Add 4 dashboard-style stat cards:
  - Goal Amount, Funds Raised, Donors Count, Days Left
- Compute days left + donors count using existing campaign fields if available; otherwise derive from existing `donations` list without changing logic.

## Step 5 — Progress widget redesign (UI-only)
- Create a mini progress bar widget with:
  - gradient bar
  - percentage label
  - raised amount + goal amount

## Step 6 — Story / Documents / Donors / Comments sections (UI-only)
- Update section card shells to match dashboard.
- Ensure hover/elevation and typography consistency.
- Keep CommentList/CommentInput and Image gallery intact.

## Step 7 — Donation sidebar redesign (UI-only)
- Restyle sticky donation card:
  - rounded-3xl, stronger shadow
  - emerald CTA gradient button
  - quick amount buttons (same onClick logic)
  - secure payment area + share button (same handlers)

## Step 8 — Mobile responsiveness
- Adjust grid/spacing to stack cards cleanly on small screens.
- Prevent overflow.

## Step 9 — Verification
- Ensure no logic changes:
  - Razorpay flow, API calls, state, handlers untouched
  - animations (framer-motion) preserved
  - responsive behavior preserved

## Step 10 — Final pass
- Lint/build (optional) and visually compare with Dashboard.

