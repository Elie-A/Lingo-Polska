import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail SMTP Connection Error:", error.message);
  } else {
    console.log("✅ Gmail SMTP Server is ready to send emails!");
  }
});

export default transporter;
