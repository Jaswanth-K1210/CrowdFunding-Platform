import express from "express";
import {
  getDashboard,
  getPendingCampaigns,
  getAllCampaigns,
  approveCampaign,
  rejectCampaign,
  getAllUsers,
  getUserDetails,
  getTransactions,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware, roleMiddleware("admin"));

router.get("/dashboard", getDashboard);
router.get("/campaigns/pending", getPendingCampaigns);
router.get("/campaigns", getAllCampaigns);
router.put("/campaigns/:id/approve", approveCampaign);
router.put("/campaigns/:id/reject", rejectCampaign);
router.get("/users", getAllUsers);
router.get("/users/:id/details", getUserDetails);
router.get("/transactions", getTransactions);

export default router;
