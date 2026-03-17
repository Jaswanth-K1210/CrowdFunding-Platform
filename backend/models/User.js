import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
    },
    avatar: {
      type: String,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    stats: {
      campaignsCreated: { type: Number, default: 0 },
      totalDonated: { type: Number, default: 0 },
      totalRaised: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
