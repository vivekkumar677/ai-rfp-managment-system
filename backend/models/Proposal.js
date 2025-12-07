import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
  rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  amount: Number,
  responseText: String,
  score: Number,
  summary: String,
  recommendation: String,
  issues: [String],
}, { timestamps: true });

const Proposal = mongoose.model("Proposal", proposalSchema);
export default Proposal;
