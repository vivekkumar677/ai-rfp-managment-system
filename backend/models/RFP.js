import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specs: { type: String },
  quantity: { type: Number, required: true },
  warranty_years: { type: Number, default: 0 },
});

const rfpSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  budget: { type: Number },
  delivery_days: { type: Number },
  payment_terms: { type: String },
  items: [itemSchema],
}, { timestamps: true });

const RFP = mongoose.model("RFP", rfpSchema);
export default RFP;