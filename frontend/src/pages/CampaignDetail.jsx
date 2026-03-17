import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
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
        },
      };

      const razor = new window.Razorpay(options);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="lg:col-span-2 space-y-6">
        <img
          src={campaign.images?.[0] || "https://placehold.co/800x400?text=Campaign"}
          alt={campaign.title}
          className="w-full rounded-lg"
        />

        <div>
          <span className={`text-xs px-2 py-1 rounded ${
            campaign.status === "approved" ? "bg-green-100 text-green-700" :
            campaign.status === "pending" ? "bg-yellow-100 text-yellow-700" :
            "bg-red-100 text-red-700"
          }`}>
            {campaign.status}
          </span>
          <h1 className="text-3xl font-bold mt-2">{campaign.title}</h1>
          <p className="text-gray-500">
            {campaign.location} - Created by {campaign.creatorId?.name}
          </p>
          <p className="text-sm text-gray-400">
            Category: {campaign.category} | Deadline: {new Date(campaign.deadline).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Story</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
        </div>

        {campaign.documents?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Documents & Proof</h2>
            {campaign.documents.map((doc, index) => (
              <a key={index} href={doc} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline">
                View Document {index + 1}
              </a>
            ))}
          </div>
        )}

        {/* Donors */}
        {donations.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Recent Donors</h2>
            <div className="space-y-2">
              {donations.slice(0, 10).map((d) => (
                <div key={d._id} className="flex justify-between border-b py-2">
                  <span>{d.donorId?.name}</span>
                  <span className="font-semibold">{formatCurrency(d.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <CommentList comments={comments} />
          <div className="mt-4">
            <CommentInput onSubmit={handleComment} />
          </div>
        </div>
      </div>

      {/* Right Sidebar — Donate Box */}
      <div className="lg:sticky lg:top-24 h-fit space-y-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-1">
            {formatCurrency(campaign.raisedAmount)} raised
          </h3>
          <p className="text-gray-500 mb-3">Goal: {formatCurrency(campaign.goalAmount)}</p>
          <p className="text-sm text-gray-500 mb-3">{campaign.donorCount} donors</p>

          <ProgressBar raised={campaign.raisedAmount} goal={campaign.goalAmount} />

          {campaign.status === "approved" && (
            <div className="mt-4 space-y-3">
              <input
                type="number"
                placeholder="Enter amount (INR)"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Leave a message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
              <button
                onClick={handleDonate}
                disabled={donating}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {donating ? "Processing..." : "Donate Now"}
              </button>
            </div>
          )}

          <button
            className="w-full mt-3 text-blue-600 text-sm hover:underline"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
          >
            Share Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetail;
