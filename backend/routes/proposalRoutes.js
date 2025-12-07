import express from "express";
import { createProposal, getProposals } from "../controllers/proposalController.js";

const router = express.Router();

router.post("/", createProposal);
router.get("/", getProposals);

export default router;