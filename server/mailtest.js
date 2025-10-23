import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from current directory
const result = dotenv.config({ path: join(__dirname, ".env") });

if (result.error) {
  console.error("❌ Error loading .env file:", result.error.message);
  process.exit(1);
}

console.log("🔧 Environment Variables Check:");
console.log("Working Directory:", process.cwd());
console.log("Script Directory:", __dirname);
console.log("---");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
console.log(
  "EMAIL_PASS:",
  process.env.EMAIL_PASS
    ? `✅ SET (${process.env.EMAIL_PASS.length} chars)`
    : "❌ NOT SET"
);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "❌ NOT SET");
console.log("---\n");

// Check if credentials exist before importing transporter
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ ERROR: Missing email credentials!");
  console.error("\nCreate a .env file in the server folder with:");
  console.error("EMAIL_USER=yourname@gmail.com");
  console.error("EMAIL_PASS=your16charpassword");
  console.error("ADMIN_EMAIL=yourname@gmail.com");
  process.exit(1);
}

// Now import transporter
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const testEmail = async () => {
  try {
    console.log("📧 Sending test email via Gmail...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "✅ Test Email - LingoPolska Gmail Setup",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #e63946;">✅ Gmail Configuration Working!</h1>
          <p>Your Gmail email setup is successful. 🎉</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    console.log("\n✅ SUCCESS! Email sent!");
    console.log("Message ID:", info.messageId);
    console.log("\n📬 Check your inbox at:", process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error("\n❌ FAILED to send email");
    console.error("Error:", error.message);
    console.error("\nFull error:", error);
  }
};

testEmail();
