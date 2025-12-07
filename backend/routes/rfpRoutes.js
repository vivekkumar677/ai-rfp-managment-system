import express from "express";
import { createRFP, getRFPs } from "../controllers/rfpController.js";
import { sendRFPToVendors } from "../controllers/sendRFPTController.js";

const router = express.Router();

router.post("/", createRFP);
router.get("/", getRFPs);
router.post("/:id/send", sendRFPToVendors);

export default router;
