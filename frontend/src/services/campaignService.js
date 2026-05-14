import api from "./api";

export const campaignService = {
  getAll: (params) => api.get("/campaigns", { params }),
  getTop: () => api.get("/campaigns/top"),
  getCategories: () => api.get("/campaigns/categories"),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => {
    const form = new FormData();
    form.append("title", data.title);
    form.append("description", data.description);
    form.append("category", data.category);
    form.append("goalAmount", data.goalAmount);
    form.append("location", data.location || "");
    form.append("deadline", data.deadline);
    (data.images || []).forEach((file) => form.append("images", file));
    (data.documents || []).forEach((file) => form.append("documents", file));
    return api.post("/campaigns", form);
  },
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  remove: (id) => api.delete(`/campaigns/${id}`),
  getMine: () => api.get("/campaigns/my/list"),
  addComment: (id, message) => api.post(`/campaigns/${id}/comments`, { message }),
};
