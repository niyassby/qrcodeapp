// models/Link.js
import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  destination: { type: String, required: true },
  isRedirect: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
}, { timestamps: true });

export default mongoose.models.Link || mongoose.model("Link", LinkSchema);
