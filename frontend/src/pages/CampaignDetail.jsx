import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaDonate,
  FaFileAlt,
  FaHandHoldingHeart,
  FaLock,
  FaUsers,
  FaRegShareSquare,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaSpinner,
} from "react-icons/fa";

import { campaignService } from "../services/campaignService";
import { donationService } from "../services/donationService";
import { useAuth } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";
import ProgressBar from "../components/common/ProgressBar";
import CommentList from "../components/comments/CommentList";
import CommentInput from "../components/comments/CommentInput";

function CampaignDetail() { 

  const { id } = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [comments, setComments] = useState([]);
  const [donations, setDonations] = useState([]);
  const [donateAmount, setDonateAmount] = useState("");
  const [message, setMessage] = useState("");
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    fetchCampaign();
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);


  const fetchCampaign = async () => {
    try {
      const res = await campaignService.getById(id);
      setCampaign(res.data.campaign);
      setComments(res.data.comments || []);
    } catch (error) {
      toast.error("Failed to load campaign");
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await donationService.getCampaignDonations(id);
      setDonations(res.data);
    } catch {
      // ignore
    }
  };

  const handleDonate = async () => {
    if (!user) {
      toast.error("Please login to donate");
      return;
    }
    if (!donateAmount || donateAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setDonating(true);
    try {
      const res = await donationService.create({
        campaignId: id,
        amount: Number(donateAmount),
        message,
        isAnonymous: false,
      });

      const { orderId, amount, currency, keyId, donation } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        order_id: orderId,
        name: "CrowdFund",
        description: `Donation to ${campaign.title}`,
        image: "/favicon.svg",
        handler: async (response) => {
          try {
            await donationService.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              donationId: donation._id,
            });
            toast.success("Donation successful! Thank you!");
            setDonateAmount("");
            setMessage("");
            fetchCampaign();
            fetchDonations();
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        notes: {
          campaignId: id,
          donationId: donation._id,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setDonating(false);
          },
        },
      };

      const razor = new window.Razorpay(options);
      razor.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setDonating(false);
      });
      razor.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Donation failed");
    } finally {
      setDonating(false);
    }
  };

  const handleComment = async (text) => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    try {
      const res = await campaignService.addComment(id, text);
      setComments([res.data, ...comments]);
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    }
  };

  if (!campaign) return <p className="text-center py-10">Loading...</p>;

  const statusBadge = (() => {
    const base = "text-xs px-3 py-1 rounded-full font-medium";
    if (campaign.status === "approved") {
      return `${base} bg-emerald-100 text-emerald-700`;
    }
    if (campaign.status === "pending") {
      return `${base} bg-yellow-100 text-yellow-700`;
    }
    return `${base} bg-red-100 text-red-700`;
  })();

  const percent = (() => {
    const goal = Number(campaign.goalAmount) || 0;
    const raised = Number(campaign.raisedAmount) || 0;
    if (!goal) return 0;
    return Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));
  }, [campaign.goalAmount, campaign.raisedAmount]);

  const shareCampaign = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start"
        >
          {/* Left */}
          <div className="lg:col-span-8 space-y-7">
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-transparent to-teal-600/15" />
              <div className="relative p-2">
                <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-inner">
                  <div className="aspect-[16/9] sm:aspect-[21/9]">
                    <img
  src={
    campaign.images?.[0] ||
    "https://placehold.co/1200x675?text=Campaign"
  }
  alt={campaign.title}
  className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
/>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Header card */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.04 }}
              className="rounded-3xl bg-white shadow-sm p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className={statusBadge}>{campaign.status}</span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {campaign.category}
                </span>
                {campaign.status === "approved" && (
                  <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FaShieldAlt className="text-emerald-600" /> Verified Campaign
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                {campaign.title}
              </h1>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/60 px-4 py-3">
                  <FaMapMarkerAlt className="text-emerald-600" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {campaign.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                  <FaCalendarAlt className="text-emerald-600" />
                  <div>
                    <div className="text-xs text-gray-500">Deadline</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {new Date(campaign.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                  <FaUsers className="text-emerald-600" />
                  <div>
                    <div className="text-xs text-gray-500">Donors</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {campaign.donorCount} supporters
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                  <FaHandHoldingHeart className="text-emerald-600" />
                  <div>
                    <div className="text-xs text-gray-500">Creator</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {campaign.creatorId?.name || "Unknown"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600/10 to-teal-600/10 px-4 py-3">
                <div>
                  <div className="text-xs text-gray-500">Raised</div>
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(campaign.raisedAmount)}
                  </div>
                </div>
                <div className="h-6 w-px bg-emerald-200/70" />
                <div>
                  <div className="text-xs text-gray-500">Funding</div>
                  <div className="text-lg font-bold text-emerald-700">{percent}%</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs text-gray-500">Goal</div>
                  <div className="text-sm font-semibold text-gray-800">
                    {formatCurrency(campaign.goalAmount)}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Story */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-3xl bg-white shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaDonate className="text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-semibold">Story</h2>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {campaign.description}
              </p>
            </motion.section>

            {/* Documents */}
            {campaign.documents?.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-3xl bg-white shadow-sm p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaFileAlt className="text-emerald-600" />
                  <h2 className="text-xl sm:text-2xl font-semibold">Documents & Proof</h2>
                </div>
                <div className="space-y-3">
                  {campaign.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/60 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                          <FaFileAlt className="text-emerald-700" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Document {index + 1}
                          </div>
                          <div className="text-xs text-gray-500">Open in new tab</div>
                        </div>
                      </div>
                      <span className="text-emerald-700 text-sm font-semibold">View</span>
                    </a>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Donors */}
            {donations.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-3xl bg-white shadow-sm p-5 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaUsers className="text-emerald-600" />
                  <h2 className="text-xl sm:text-2xl font-semibold">Recent Donors</h2>
                </div>
                <div className="space-y-2">
                  {donations.slice(0, 10).map((d) => {
                    const name = d.donorId?.name || "Anonymous";
                    const initials = name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase())
                      .join("");
                    return (
                      <div
                        key={d._id}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center font-bold">
                            {initials || "—"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {name}
                            </div>
                            <div className="text-xs text-gray-500">Supporter</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {formatCurrency(d.amount)}
                          </div>
                          <div className="text-xs text-emerald-700 font-semibold">Thank you</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Comments */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="rounded-3xl bg-white shadow-sm p-5 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaHandHoldingHeart className="text-emerald-600" />
                <h2 className="text-xl sm:text-2xl font-semibold">Comments</h2>
              </div>
              <CommentList comments={comments} />
              <div className="mt-4">
                <CommentInput onSubmit={handleComment} />
              </div>
            </motion.section>
          </div>

          {/* Right: Donate card */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-5">
              <motion.aside
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-3xl bg-white shadow-xl ring-1 ring-emerald-100/60 overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent" />
                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Total Raised</div>
                        <div className="text-2xl font-extrabold text-gray-900">
                          {formatCurrency(campaign.raisedAmount)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Goal</div>
                        <div className="text-sm font-semibold text-gray-800">
                          {formatCurrency(campaign.goalAmount)}
                        </div>
                        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <FaShieldAlt className="text-emerald-700" /> Secure
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />
                    </div>

                    {campaign.status !== "approved" ? (
                      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                          Donations unlock once this campaign is approved.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-3">
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "₹100", value: 100 },
                            { label: "₹500", value: 500 },
                            { label: "₹1000", value: 1000 },
                            { label: "₹5000", value: 5000 },
                          ].map((b) => (
                            <button
                              key={b.value}
                              type="button"
                              onClick={() => setDonateAmount(String(b.value))}
                              className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-2 py-2 text-xs font-bold text-emerald-800 transition-all hover:-translate-y-0.5 hover:bg-emerald-100 active:translate-y-0"
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={donateAmount}
                            onChange={(e) => setDonateAmount(e.target.value)}
                            placeholder=" "
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                          />
                          <label className="pointer-events-none absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-600">
                            Amount (INR)
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder=" "
                            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                          />
                          <label className="pointer-events-none absolute left-4 -top-2.5 bg-white px-2 text-xs font-semibold text-gray-600">
                            Message (optional)
                          </label>
                        </div>

                        <motion.button
                          type="button"
                          onClick={handleDonate}
                          disabled={donating}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 font-extrabold text-base shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-70"
                        >
                          <span className="inline-flex items-center justify-center gap-2">
                            {donating ? (
                              <FaSpinner className="animate-spin" />
                            ) : (
                              <FaDonate />
                            )}
                            {donating ? "Processing..." : "Donate Now"}
                          </span>
                        </motion.button>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
                        <FaLock className="text-emerald-700" /> Secure payments via Razorpay
                      </div>

                      <button
                        type="button"
                        onClick={shareCampaign}
                        className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100 active:translate-y-0"
                      >
                        <FaRegShareSquare className="text-emerald-700" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

}

export default CampaignDetail;
