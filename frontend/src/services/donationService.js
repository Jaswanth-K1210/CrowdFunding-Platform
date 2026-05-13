import api from "./api";

export const donationService = {
  create: (data) => api.post("/donations/create", data),
  verify: (data) => api.post("/donations/verify", data),
  getCampaignDonations: (campaignId) => api.get(`/donations/campaign/${campaignId}`),
  getMine: () => api.get("/donations/my"),
  downloadInvoice: (donationId) => api.get(`/donations/${donationId}/invoice`, { responseType: "blob" }),
};
