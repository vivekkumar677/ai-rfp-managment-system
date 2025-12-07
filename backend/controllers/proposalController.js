import Proposal from "../models/Proposal.js";
import RFP from "../models/RFP.js";
import Vendor from "../models/Vendor.js";
import { analyzeProposal } from "../services/aiService.js";
import { sendEmail } from "../services/emailService.js";

export const createProposal = async (req, res) => {
  try {
    const { rfp: rfpId, vendor: vendorId, amount, proposalText } = req.body;

    // Validate RFP & Vendor exist
    const rfp = await RFP.findById(rfpId);
    if (!rfp) return res.status(404).json({ message: "RFP not found" });

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Analyze proposal using AI
    const analysis = await analyzeProposal(proposalText);
    if (!analysis || !analysis.score) {
      return res.status(500).json({ message: "AI analysis failed or returned invalid data." });
    }

    // Save proposal
    const proposal = new Proposal({
      rfp: rfpId,
      vendor: vendorId,
      amount,
      proposalText,
      analysis,
      submittedAt: new Date(),
    });
    await proposal.save();

    // Send notification email to vendor
    const emailSubject = `Proposal Submitted for RFP: ${rfp.title}`;
    const emailBody = `
Hello ${vendor.name},

Your proposal for "${rfp.title}" has been received.

Proposal Analysis Score: ${analysis.score}
Summary: ${analysis.summary}

Thank you,
AI RFP Management System
`;
    await sendEmail(vendor.email, emailSubject, emailBody);

    res.status(201).json({ proposal, analysis });
  } catch (error) {
    console.error("Error creating proposal:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProposals = async (req, res) => {
  try {
    const { rfpId } = req.params;
    const proposals = await Proposal.find({ rfpId }).populate("vendorId", "name email")
      .populate("rfp vendor")
      .populate("rfp", "title description");
    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load proposals." });
  }
};
