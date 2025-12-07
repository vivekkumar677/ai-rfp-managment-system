import express from "express";
import { createRFPResponse, compareRFPResponses } from "../controllers/RFPResponseController.js";

const router = express.Router();

router.post("/responses", createRFPResponse);         // submit vendor response
router.get("/responses/compare/:rfpId", compareRFPResponses); // compare

export default router;
