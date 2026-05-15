import api from "./api";

export const adminService = {
  getDashboard:         ()       => api.get("/admin/dashboard"),
  getPendingCampaigns:  ()       => api.get("/admin/campaigns/pending"),
  getAllCampaigns:       ()       => api.get("/admin/campaigns"),
  approveCampaign:      (id, note) => api.put(`/admin/campaigns/${id}/approve`, { adminNote: note }),
  rejectCampaign:       (id, note) => api.put(`/admin/campaigns/${id}/reject`,  { adminNote: note }),
  getAllUsers:           ()       => api.get("/admin/users"),
  getUserDetails:        (id)     => api.get(`/admin/users/${id}/details`),
  getTransactions:       ()       => api.get("/admin/transactions"),
};
