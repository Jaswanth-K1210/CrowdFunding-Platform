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

import CommentList from "../components/comments/CommentList";
import CommentInput from "../components/comments/CommentInput";
import ImageGallery from "../components/common/ImageGallery";


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



  const shareCampaign = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  // UI-only helpers for dashboard-like widgets
  const daysLeft = (() => {
    if (!campaign?.deadline) return 0;
    const diff = new Date(campaign.deadline).getTime() - Date.now();
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  })();

  const raised = Number(campaign.raisedAmount || 0);
  const goal = Number(campaign.goalAmount || 0);
  const pct = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  const donorsCount = donations?.length ? donations.length : campaign.donorCount || 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start"
        >
          {/* Left */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {/* Hero banner from existing campaign.images */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.02 }}
              className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
            >
              {campaign.images?.[0] && (
                <div className="relative">
                  <img
                    src={campaign.images[0]}
                    alt={campaign.title}
                    className="h-44 sm:h-52 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
                  <div className="absolute inset-x-0 top-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className={statusBadge}>{campaign.status}</span>
                      <span className="text-xs sm:text-sm bg-white/90 backdrop-blur px-3 py-1 rounded-full text-gray-700 font-medium">
                        {campaign.category}
                      </span>
                      {campaign.status === "approved" && (
                        <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <FaShieldAlt className="text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white text-xl font-black shadow-md">
                    {(campaign.creatorId?.name || "?").split(" ")[0]?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                      {campaign.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
                        <FaMapMarkerAlt className="text-emerald-600" />
                        <span className="line-clamp-1">{campaign.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700">
                        <FaCalendarAlt className="text-emerald-600" />
                        <span>{new Date(campaign.deadline).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compact stats row */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3">
                    <div className="text-xs text-gray-500 font-medium">Goal Amount</div>
                    <div className="text-lg font-black text-gray-900">{formatCurrency(campaign.goalAmount)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3">
                    <div className="text-xs text-gray-500 font-medium">Funds Raised</div>
                    <div className="text-lg font-black text-emerald-700">{formatCurrency(campaign.raisedAmount)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3">
                    <div className="text-xs text-gray-500 font-medium">Donors</div>
                    <div className="text-lg font-black text-gray-900">{donorsCount}</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-3">
                    <div className="text-xs text-gray-500 font-medium">Days Left</div>
                    <div className="text-lg font-black text-gray-900">{daysLeft}</div>
                  </div>
                </div>

                {/* Progress widget */}
                <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Progress</div>
                      <div className="text-lg font-black text-gray-900">{Math.round(pct)}%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Raised</div>
                      <div className="text-sm font-semibold text-emerald-700">{formatCurrency(raised)}</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Goal: {formatCurrency(goal)}</span>
                    <span>{Math.round(pct)}% of goal</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Preserve existing image gallery functionality */}
            <ImageGallery images={campaign.images} title={campaign.title} />

            {/* Story */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <FaDonate className="text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-800">Story</h2>
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
                className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <FaFileAlt className="text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-800">Documents & Proof</h2>
                </div>
                <div className="space-y-2.5">
                  {campaign.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <FaFileAlt className="text-emerald-700" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Document {index + 1}</div>
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
                className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <FaUsers className="text-emerald-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-800">Recent Donors</h2>
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
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-2xl bg-emerald-600/10 text-emerald-800 flex items-center justify-center font-bold">
                            {initials || "—"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">{name}</div>
                            <div className="text-xs text-gray-500">Supporter</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-emerald-700">{formatCurrency(d.amount)}</div>
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
              className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <FaHandHoldingHeart className="text-emerald-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-800">Comments</h2>
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
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-3xl bg-white shadow-xl ring-1 ring-emerald-100/60 overflow-hidden"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/10 via-transparent to-transparent" />
                  <div className="relative p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Target</div>
                        <div className="text-2xl font-extrabold text-gray-900">{formatCurrency(campaign.goalAmount)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="text-sm font-semibold text-gray-800">{campaign.status}</div>
                        <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <FaShieldAlt className="text-emerald-700" /> Secure
                        </div>
                      </div>
                    </div>

                    {campaign.status !== "approved" ? (
                      <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">Donations are available once this campaign is approved.</p>
                      </div>
                    ) : (
                      <div className="mt-5 space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 font-semibold mb-2">Quick amounts</div>
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
                            {donating ? <FaSpinner className="animate-spin" /> : <FaDonate />}
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
                        <FaRegShareSquare className="text-emerald-700" /> Share
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
