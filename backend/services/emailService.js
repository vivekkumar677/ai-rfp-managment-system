import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT==465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

export const sendEmail = async (vendor, rfp) => {
  try {
    const mailOptions = {
      from: `"RFP Management System" <${process.env.SMTP_USER}>`,
      to: vendor.email,
      subject: `New RFP: ${rfp.title}`,
      text: `Dear ${vendor.name},

Please find the new RFP details below:

Title: ${rfp.title}
Description: ${rfp.description}
Budget: ${rfp.budget}
Delivery Days: ${rfp.delivery_days}
Payment Terms: ${rfp.payment_terms}

Best regards,
RFP Management Team`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

