import api from "./api";

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getPendingCampaigns: () => api.get("/admin/campaigns/pending"),
  getAllCampaigns: () => api.get("/admin/campaigns"),
  approveCampaign: (id, adminNote) => api.put(`/admin/campaigns/${id}/approve`, { adminNote }),
  rejectCampaign: (id, adminNote) => api.put(`/admin/campaigns/${id}/reject`, { adminNote }),
  getUsers: (search) => api.get(`/admin/users?search=${search || ''}`),
  getAllUsers: () => api.get("/admin/users"),

  getTransactions: () => api.get("/admin/transactions"),
};
