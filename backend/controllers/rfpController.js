import RFP from "../models/RFP.js";
import { generateRFP } from "../services/aiService.js";

// Create a new RFP
export const createRFP = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Requirement text is required" });

    const rfpData = await generateRFP(text);
    if (!rfpData) return res.status(500).json({ message: "AI returned null or invalid output" });

    const rfp = new RFP(rfpData);
    await rfp.save();

    res.status(201).json(rfp);

  } catch (error) {
    console.error("Create RFP Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all RFPs
export const getRFPs = async (req, res) => {
  try {
    const rfps = await RFP.find();
    res.status(200).json(rfps);
  } catch (error) {
    console.error("Get RFPs Error:", error);
    res.status(500).json({ message: error.message });
  }
};
