import api from "./api";

export const campaignService = {
  getAll: (params) => api.get("/campaigns", { params }),
  getTop: () => api.get("/campaigns/top"),
  getCategories: () => api.get("/campaigns/categories"),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post("/campaigns", data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  remove: (id) => api.delete(`/campaigns/${id}`),
  getMine: () => api.get("/campaigns/my/list"),
  addComment: (id, message) => api.post(`/campaigns/${id}/comments`, { message }),
};
