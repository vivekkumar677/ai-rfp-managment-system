// models/Proposal.js
import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
  vendorName: { type: String, required: true },
  proposalText: { type: String, required: true },
  analysis: {
    score: Number,
    summary: String,
    issues: [String],
    recommendation: String,
  },
  submittedAt: Date,
});

export default mongoose.model("Proposal", proposalSchema);
