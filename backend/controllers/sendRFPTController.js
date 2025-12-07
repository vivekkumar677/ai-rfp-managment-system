import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import { sendEmail } from "../services/emailService.js";

export const sendRFPToVendors = async (req, res) => {
  const { vendorIds } = req.body;
  const { id } = req.params;

  try {
    const rfp = await RFP.findById(id);
    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    const emailPromises = vendors.map((v) => sendEmail(v, rfp));

    await Promise.all(emailPromises);

    res.status(200).json({ message: "RFP sent to selected vendors." });
  } catch (error) {
    console.error("Send RFP Error:", error);
    res.status(500).json({ message: "Failed to send RFP", error: error.message });
  }
};
