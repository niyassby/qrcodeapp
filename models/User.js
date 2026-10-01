// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    shortUserId: { type: String, unique: true, sparse: true }, // 6-digit user ID
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    subscriptionEndDate: { type: Date },
    // razorpayCustomerId: { type: String },
    // razorpaySubscriptionId: { type: String },
    // razorpaySubscriptionStatus: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
