import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  categories: [String],
  rating: Number,
  }, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;