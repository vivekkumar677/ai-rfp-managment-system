import Imap from "imap";
import { simpleParser } from "mailparser";
import Proposal from "../models/Proposal.js";
import { analyzeProposal } from "../services/aiService.js"; // <== GROQ AI
import RFP from "../models/RFP.js";

const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: process.env.IMAP_HOST,
  port: Number(process.env.IMAP_PORT) || 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
});

export const startListening = () => {
  imap.once("ready", () => {
    console.log("IMAP connected. Listening for new emails...");

    imap.openBox("INBOX", false, (err, box) => {
      if (err) {
        console.error("IMAP openBox error:", err);
        return;
      }

      imap.on("mail", () => {
        console.log("📩 New email detected. Checking...");

        imap.search(["UNSEEN"], async (err, results) => {
          if (err || !results || results.length === 0) return;

          const f = imap.fetch(results, { bodies: "" });

          f.on("message", (msg) => {
            msg.on("body", async (stream) => {
              const parsed = await simpleParser(stream);

              const vendorEmail = parsed.from?.value?.[0]?.address;
              const emailText = parsed.text || parsed.html || "";

              console.log(`📨 Email received from: ${vendorEmail}`);
              console.log(`📝 Subject: ${parsed.subject}`);

              try {
                // Find the most recent proposal from this vendor
                const proposal = await Proposal.findOne({ vendorEmail }).sort({
                  submittedAt: -1,
                });

                if (!proposal) {
                  console.log("⚠ No related proposal found for vendor:", vendorEmail);
                  return;
                }

                // Fetch original RFP
                const rfp = await RFP.findById(proposal.rfpId);
                if (!rfp) {
                  console.log("⚠ RFP not found for proposal:", proposal._id);
                  return;
                }

                console.log("🤖 Sending email content to Groq for analysis...");

                // AI Analysis = vendor proposal vs. RFP
                const aiResult = await analyzeProposal(emailText, rfp.structuredRFP);

                proposal.emailReply = {
                  subject: parsed.subject,
                  body: emailText,
                  receivedAt: new Date(),
                };

                proposal.analysis = JSON.parse(aiResult); // Store JSON response
                await proposal.save();

                console.log(`✅ Proposal updated with AI analysis for ${proposal._id}`);
              } catch (error) {
                console.error("❌ Email processing error:", error);
              }
            });
          });
        });
      });
    });
  });

  imap.once("error", (err) =>
    console.error("❌ IMAP connection error:", err.message)
  );

  imap.once("end", () => console.log("🔌 IMAP connection ended."));

  imap.connect();
};
