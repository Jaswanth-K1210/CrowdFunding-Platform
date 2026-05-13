import nodemailer from "nodemailer";
import "dotenv/config";

const isEmailConfigured =
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  !process.env.EMAIL_USER.startsWith("your_");

let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const sendMail = async (mailOptions) => {
  if (!transporter) {
    console.log("Email not configured, skipping:", mailOptions.subject);
    return;
  }
  await transporter.sendMail(mailOptions);
};

export const sendDonationReceipt = async (toEmail, donorName, amount, campaignTitle, campaignId, attachment = null) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Donation Receipt",
    html: `
      <h2>Thank you for your generous donation, ${donorName}! ❤️ 🙌</h2>
      <p>We've successfully received your contribution of <strong>Rs. ${amount.toLocaleString("en-IN")}</strong> to the campaign <strong>"${campaignTitle}"</strong>.</p>
      <p>Your support makes a huge difference. Please find your official donation receipt attached to this email.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Help us reach our goal faster! 🚀</h3>
        <p style="color: #4b5563; margin-bottom: 15px;">You can multiply your impact by sharing this campaign with your friends, family, and network so that others might also donate. Every share counts!</p>
        <a href="http://localhost:5173/campaign/${campaignId}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">View & Share Campaign</a>
      </div>

      <p>With immense gratitude,<br/>The CrowdFunding Team</p>
    `,
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: `invoice-${Date.now()}.pdf`,
        content: attachment,
      },
    ];
  }

  await sendMail(mailOptions);
};

export const sendCampaignApproved = async (toEmail, campaignTitle) => {
  await sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your campaign is now live!",
    html: `
      <h2>Congratulations!</h2>
      <p>Your campaign <strong>${campaignTitle}</strong> has been approved and is now live on our platform.</p>
      <p>Share it with your network to start receiving donations.</p>
    `,
  });
};

export const sendCampaignRejected = async (toEmail, campaignTitle, reason) => {
  await sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Campaign Update",
    html: `
      <h2>Campaign Update</h2>
      <p>Your campaign <strong>${campaignTitle}</strong> was not approved.</p>
      <p><strong>Reason:</strong> ${reason || "No reason provided."}</p>
      <p>You can edit and resubmit your campaign.</p>
    `,
  });
};
