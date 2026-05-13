import Campaign from "../models/Campaign.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

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
    const {
      title,
      description,
      category,
      goalAmount,
      images,
      documents,
      location,
      deadline,
    } = req.body;

    const campaign = await Campaign.create({
      creatorId: req.user._id,
      title,
      description,
      category,
      goalAmount,
      images,
      documents,
      location,
      deadline,
      status: "pending",
    });

    // Increment user's campaignsCreated stat
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.campaignsCreated": 1 },
    });

    res.status(201).json(campaign);
  } catch (error) {
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
