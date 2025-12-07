import dotenv from "dotenv";
dotenv.config(); // Load .env first

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import rfpRoutes from "./routes/rfpRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import { startListening } from "./services/imapListener.js";
import responseRoutes from "./routes/responseRoutes.js";

console.log("Starting server...");

// Connect to MongoDB
connectDB();

// Start IMAP listener
startListening();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/rfps", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api", responseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("AI RFP Management System Backend is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
