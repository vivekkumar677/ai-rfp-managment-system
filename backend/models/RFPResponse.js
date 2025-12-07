import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    responseText: { type: String, required: true },
    score: { type: Number, default: 0 },
    summary: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("RFPResponse", responseSchema);
