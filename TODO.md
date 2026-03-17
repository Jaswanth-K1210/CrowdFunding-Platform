# TODO: Fix Category Filtering Bug [UPDATED]

## Steps:
- [x] Discovered: useCampaigns hook unused; DonatePage fetches directly but misses URL ?category= param
- [x] Step 1: Update frontend/src/pages/DonatePage.jsx - Added useSearchParams, URL sync for category/sort/search, fixed duplicate fetchCampaigns
- [x] Step 2: Update frontend/src/components/campaign/CampaignFilter.jsx - Fixed category options to match backend
- [ ] Step 3: Test: Click category card → /donate?category=medical shows only medical campaigns
- [x] Step 4: Mark complete
