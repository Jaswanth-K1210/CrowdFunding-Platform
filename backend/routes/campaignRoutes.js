import express from "express";
import multer from "multer";
import {
  getCampaigns,
  getTopCampaigns,
  getCategories,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns,
  addComment,
} from "../controllers/campaignController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Public routes
router.get("/top", getTopCampaigns);
router.get("/categories", getCategories);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);

// Protected routes
router.post("/", authMiddleware, upload.fields([
  { name: "images", maxCount: 5 },
  { name: "documents", maxCount: 5 },
]), createCampaign);
router.put("/:id", authMiddleware, updateCampaign);
router.delete("/:id", authMiddleware, deleteCampaign);
router.get("/my/list", authMiddleware, getMyCampaigns);
router.post("/:id/comments", authMiddleware, addComment);

export default router;
