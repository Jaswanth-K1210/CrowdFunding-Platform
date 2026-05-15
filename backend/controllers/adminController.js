import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import Donation from "../models/Donation.js";
import { sendCampaignApproved, sendCampaignRejected } from "../services/emailService.js";

// GET /api/admin/dashboard — analytics overview
export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalCampaigns, totalDonations, moneyAgg] = await Promise.all([
      User.countDocuments(),
      Campaign.countDocuments(),
      Donation.countDocuments({ paymentStatus: "completed" }),
      Donation.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    res.json({
      totalUsers,
      totalCampaigns,
      totalDonations,
      totalMoneyRaised: moneyAgg[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/campaigns/pending
export const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" })
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/campaigns — all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/admin/campaigns/:id/approve
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "approved", adminNote: req.body.adminNote || "" },
      { returnDocument: 'after' }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Notify creator via email (non-blocking)
    const creator = await User.findById(campaign.creatorId);
    sendCampaignApproved(creator.email, campaign.title).catch(console.error);

    res.json({ message: "Campaign approved", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/admin/campaigns/:id/reject
export const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", adminNote: req.body.adminNote || "" },
      { returnDocument: 'after' }
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Notify creator via email (non-blocking)
    const creator = await User.findById(campaign.creatorId);
    sendCampaignRejected(creator.email, campaign.title, req.body.adminNote).catch(console.error);

    res.json({ message: "Campaign rejected", campaign });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/users — all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/users/:id/details — single user + their campaigns + donations
export const getUserDetails = async (req, res) => {
  try {
    const [user, campaigns, donations] = await Promise.all([
      User.findById(req.params.id).select("-passwordHash"),
      Campaign.find({ creatorId: req.params.id }).sort({ createdAt: -1 }),
      Donation.find({ donorId: req.params.id, paymentStatus: "completed" })
        .populate("campaignId", "title images")
        .sort({ createdAt: -1 }),
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user, campaigns, donations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/admin/transactions — all completed donations
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Donation.find({ paymentStatus: "completed" })
      .populate("donorId", "name email")
      .populate("campaignId", "title")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
