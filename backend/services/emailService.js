import nodemailer from "nodemailer";

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

export const sendDonationReceipt = async (toEmail, donorName, amount, campaignTitle) => {
  await sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Donation Receipt",
    html: `
      <h2>Thank you for your donation, ${donorName}!</h2>
      <p>You donated <strong>₹${amount}</strong> to <strong>${campaignTitle}</strong>.</p>
      <p>Your support makes a difference.</p>
    `,
  });
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
