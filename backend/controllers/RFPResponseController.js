import RFPResponse from "../models/RFPResponse.js";
import Vendor from "../models/Vendor.js";

// CREATE RESPONSE
export const createRFPResponse = async (req, res) => {
    try {
        const { rfpId, vendorId, responseText } = req.body;

        if (!rfpId || !vendorId || !responseText) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const response = new RFPResponse({ rfpId, vendorId, responseText });
        await response.save();

        res.status(201).json({ message: "Response submitted", response });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// COMPARE RESPONSES
export const compareRFPResponses = async (req, res) => {
    try {
        const { rfpId } = req.params;

        const responses = await RFPResponse.find({ rfpId });
        if (!responses.length) {
            return res.status(404).json({ message: "No responses found" });
        }

        // AI-Like Scoring Logic
        const analyzed = responses.map(r => {
            const score = Math.min(100, r.responseText.length % 100 + 20); // simple example
            const summary = r.responseText.substring(0, 150) + "...";

            return {
                vendorId: r.vendorId,
                score,
                summary,
                fullResponse: r.responseText,
            };
        });

        res.status(200).json(analyzed);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
