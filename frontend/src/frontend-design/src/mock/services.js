import { MOCK_CAMPAIGNS, MOCK_DONATIONS, MOCK_CAMPAIGN_DONORS } from "./mockData.js";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/* campaignService */
export const campaignService = {
  getAll: async (params = {}) => {
    await delay();
    let list = [...MOCK_CAMPAIGNS];
    if (params.category) list = list.filter((c) => c.category === params.category);
    if (params.search)   list = list.filter((c) => c.title.toLowerCase().includes(params.search.toLowerCase()));
    if (params.sort === "most-funded") list.sort((a, b) => b.raisedAmount - a.raisedAmount);
    if (params.sort === "newest")      list.sort((a, b) => b._id.localeCompare(a._id));
    if (params.sort === "ending-soon") list.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    return { data: { campaigns: list } };
  },
  getById: async (id) => {
    await delay();
    const campaign = MOCK_CAMPAIGNS.find((c) => c._id === id) || MOCK_CAMPAIGNS[0];
    return { data: { campaign, comments: [] } };
  },
  getMine: async () => {
    await delay();
    return { data: { campaigns: MOCK_CAMPAIGNS.slice(0, 3).map((c) => ({ ...c, status: ["approved","pending","approved"][MOCK_CAMPAIGNS.indexOf(c)] || "approved" })) } };
  },
  create: async () => {
    await delay(800);
    return { data: { message: "Campaign submitted for review" } };
  },
  update: async (id, data) => {
    await delay(600);
    const base = MOCK_CAMPAIGNS.find((c) => c._id === id) || MOCK_CAMPAIGNS[0];
    return { data: { ...base, ...data } };
  },
  delete: async () => { await delay(300); return { data: { ok: true } }; },
};

/* donationService */
export const donationService = {
  getMine: async () => {
    await delay();
    return { data: MOCK_DONATIONS };
  },
  getCampaignDonations: async () => {
    await delay(300);
    return { data: MOCK_CAMPAIGN_DONORS };
  },
  create: async (data) => {
    await delay(500);
    return { data: { razorpayOrderId: null, donationId: "mock-don", amount: data.amount * 100 } };
  },
  verify: async () => { await delay(300); return { data: { ok: true } }; },
  downloadInvoice: async () => {
    await delay(400);
    throw new Error("Invoice download not available in preview mode");
  },
};

/* authService */
export const authService = {
  login: async ({ email, password }) => {
    await delay(600);
    if (!email || !password) throw { response: { data: { message: "Email and password required" } } };
    return { data: { user: { _id: "u1", name: "Jaswanth K", email }, token: "mock-token" } };
  },
  register: async ({ name, email, password }) => {
    await delay(600);
    if (!name || !email || !password) throw { response: { data: { message: "All fields required" } } };
    return { data: { user: { _id: "u1", name, email }, token: "mock-token" } };
  },
  logout: async () => delay(200),
};
