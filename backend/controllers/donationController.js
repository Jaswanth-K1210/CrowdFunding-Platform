import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/User.js";
import { createOrder, verifyPayment } from "../services/paymentService.js";
import { sendDonationReceipt } from "../services/emailService.js";

// POST /api/donations/create — initiate donation (creates Razorpay order)
export const initiateDonation = async (req, res) => {
  try {
    const { campaignId, amount, message, isAnonymous } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== "approved") {
      return res.status(400).json({ message: "Campaign not available for donations" });
    }

    // Create Razorpay order
    const order = await createOrder(amount);

    // Save donation as pending
    const donation = await Donation.create({
      donorId: req.user._id,
      campaignId,
      amount,
      paymentId: order.id,
      paymentStatus: "pending",
      message,
      isAnonymous,
    });

    res.status(201).json({
      donation,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/donations/verify — verify Razorpay payment after checkout
export const verifyDonation = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, donationId } = req.body;

    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

    if (!isValid) {
      await Donation.findByIdAndUpdate(donationId, { paymentStatus: "failed" });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update donation
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        paymentId: razorpayPaymentId,
        paymentStatus: "completed",
      },
      { new: true }
    );

    // Atomically update campaign raisedAmount and donorCount
    await Campaign.findByIdAndUpdate(donation.campaignId, {
      $inc: {
        raisedAmount: donation.amount,
        donorCount: 1,
      },
    });

    // Update donor's totalDonated stat
    await User.findByIdAndUpdate(donation.donorId, {
      $inc: { "stats.totalDonated": donation.amount },
    });

    // Update campaign creator's totalRaised stat
    const campaign = await Campaign.findById(donation.campaignId);
    await User.findByIdAndUpdate(campaign.creatorId, {
      $inc: { "stats.totalRaised": donation.amount },
    });

    // Send receipt email (non-blocking)
    const donor = await User.findById(donation.donorId);
    sendDonationReceipt(donor.email, donor.name, donation.amount, campaign.title).catch(
      console.error
    );

    res.json({ message: "Payment verified successfully", donation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/donations/campaign/:campaignId — donations for a campaign
export const getCampaignDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      campaignId: req.params.campaignId,
      paymentStatus: "completed",
    })
      .populate("donorId", "name avatar")
      .sort({ createdAt: -1 });

    // Hide donor info for anonymous donations
    const result = donations.map((d) => {
      const obj = d.toObject();
      if (obj.isAnonymous) {
        obj.donorId = { name: "Anonymous", avatar: null };
      }
      return obj;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/donations/my — logged-in user's donations
export const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({
      donorId: req.user._id,
      paymentStatus: "completed",
    })
      .populate("campaignId", "title images")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
