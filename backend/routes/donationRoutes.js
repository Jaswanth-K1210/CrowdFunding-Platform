import express from "express";
import {
  initiateDonation,
  verifyDonation,
  getCampaignDonations,
  getMyDonations,
} from "../controllers/donationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, initiateDonation);
router.post("/verify", authMiddleware, verifyDonation);
router.get("/campaign/:campaignId", getCampaignDonations);
router.get("/my", authMiddleware, getMyDonations);

export default router;
