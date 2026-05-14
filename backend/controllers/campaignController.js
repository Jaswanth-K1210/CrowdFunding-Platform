import Campaign from "../models/Campaign.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

// GET /api/campaigns — all campaigns with status visible
export const getCampaigns = async (req, res) => {
  try {
    const { category, search, sort, status, limit = 10, page = 1 } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === "most-funded") sortOption = { raisedAmount: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };
    if (sort === "ending-soon") sortOption = { deadline: 1 };

    const skip = (Number(page) - 1) * Number(limit);

    const campaigns = await Campaign.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("creatorId", "name avatar location");

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/campaigns/top — top fundraisers for homepage
export const getTopCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "approved" })
      .sort({ raisedAmount: -1 })
      .limit(6)
      .populate("creatorId", "name avatar");

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/categories
export const getCategories = async (req, res) => {
  const categories = [
    "education",
    "medical",
    "animals",
    "business",
    "ngo",
    "community",
    "emergency",
    "technology",
  ];
  res.json(categories);
};
// GET api/campaaigns/me
// Duplicate declaration removed. Use the other 'getMyCampaigns' function below.
// GET /api/campaigns/:id
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "creatorId",
      "name avatar location email"
    );

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const comments = await Comment.find({ campaignId: campaign._id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ campaign, comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/campaigns — create (auth required)
export const createCampaign = async (req, res) => {
  try {
    console.log("--- CREATE CAMPAIGN DEBUG ---");
    console.log("User:", req.user?._id);
    const { title, description, category, goalAmount, location, deadline } = req.body;
    console.log("Body:", { title, description: description?.substring(0, 50), category, goalAmount, location, deadline });

    const imageFiles = req.files?.images || [];
    const documentFiles = req.files?.documents || [];
    console.log("Files - images:", imageFiles.length, "documents:", documentFiles.length);

    // --- Step 1: Upload images to Cloudinary ---
    let imageUrls = [];
    if (imageFiles.length) {
      try {
        console.log("Uploading images to Cloudinary...");
        imageUrls = await Promise.all(
          imageFiles.map((f) => uploadBuffer(f.buffer, "crowdfunding/images", "image"))
        );
        console.log("Image upload done:", imageUrls);
      } catch (uploadErr) {
        console.error("CLOUDINARY IMAGE UPLOAD ERROR:", uploadErr);
        return res.status(500).json({ message: "Image upload failed", error: uploadErr.message });
      }
    }

    // --- Step 2: Upload documents to Cloudinary ---
    let documentUrls = [];
    if (documentFiles.length) {
      try {
        console.log("Uploading documents to Cloudinary...");
        documentUrls = await Promise.all(
          documentFiles.map((f) => uploadBuffer(f.buffer, "crowdfunding/documents", "raw"))
        );
        console.log("Document upload done:", documentUrls);
      } catch (uploadErr) {
        console.error("CLOUDINARY DOCUMENT UPLOAD ERROR:", uploadErr);
        return res.status(500).json({ message: "Document upload failed", error: uploadErr.message });
      }
    }

    // --- Step 3: Save campaign to MongoDB ---
    let campaign;
    try {
      console.log("Creating campaign in DB...");
      campaign = await Campaign.create({
        creatorId: req.user._id,
        title,
        description,
        category,
        goalAmount,
        images: imageUrls,
        documents: documentUrls,
        location,
        deadline,
        status: "pending",
      });
      console.log("Campaign created:", campaign._id);
    } catch (dbErr) {
      console.error("MONGODB CREATE ERROR:", dbErr);
      return res.status(500).json({ message: "Failed to save campaign", error: dbErr.message });
    }

    // --- Step 4: Update user stats ---
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { "stats.campaignsCreated": 1 },
      });
    } catch (statsErr) {
      console.error("USER STATS UPDATE ERROR:", statsErr);
      // Non-critical — campaign was created, just log it
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error("CREATE CAMPAIGN UNEXPECTED ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/campaigns/:id — update own campaign
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, category, goalAmount, images, documents, location, deadline } =
      req.body;

    const updated = await Campaign.findByIdAndUpdate(
      req.params.id,
      { title, description, category, goalAmount, images, documents, location, deadline },
      { returnDocument: 'after' }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/campaigns/:id — delete own campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/campaigns/my — get logged-in user's campaigns
export const getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ creatorId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/campaigns/:id/comments — add comment
export const addComment = async (req, res) => {
  try {
    const { message } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const comment = await Comment.create({
      campaignId: req.params.id,
      userId: req.user._id,
      message,
    });

    const populated = await comment.populate("userId", "name avatar");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
