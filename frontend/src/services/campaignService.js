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
  update: (id, data) => {
    const form = new FormData();
    const fields = ["title", "description", "category", "goalAmount", "location", "deadline"];
    fields.forEach((f) => { if (data[f] !== undefined) form.append(f, data[f]); });
    (data.existingImages || []).forEach((url) => form.append("existingImages", url));
    (data.existingDocuments || []).forEach((url) => form.append("existingDocuments", url));
    (data.newImages || []).forEach((file) => form.append("images", file));
    (data.newDocuments || []).forEach((file) => form.append("documents", file));
    return api.put(`/campaigns/${id}`, form);
  },
  remove: (id) => api.delete(`/campaigns/${id}`),
  getMine: () => api.get("/campaigns/my/list"),
  addComment: (id, message) => api.post(`/campaigns/${id}/comments`, { message }),
};
