import Contact from "../models/Contact.js";
import transporter from "../config/email.js";

export const sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("📧 Contact form received:", { name, email });

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to database
    console.log("💾 Saving to database...");
    const contact = await Contact.create({ name, email, message });
    console.log("✅ Saved to database");

    // Email to admin
    console.log("📨 Sending email to admin...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #e63946;">🇵🇱 New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #e63946; margin: 15px 0;">
              ${message}
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <small style="color: #666;">Received: ${new Date().toLocaleString()}</small>
          </div>
        </div>
      `,
    });
    console.log("✅ Admin email sent");

    // Auto-reply to user
    console.log("📨 Sending auto-reply to user...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Dziękujemy! Thanks for contacting LingoPolska 🇵🇱",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #e63946;">Dziękujemy, ${name}!</h2>
            <p>Thank you for reaching out to <strong>LingoPolska</strong>.</p>
            <p>We've received your message and will respond as soon as possible.</p>
            <div style="background: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Your message:</strong></p>
              <p style="font-style: italic; color: #555;">${message}</p>
            </div>
            <p>Keep learning Polish! 🇵🇱</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666;">Best regards,<br><strong>The LingoPolska Team</strong></p>
          </div>
        </div>
      `,
    });
    console.log("✅ User email sent");

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again.",
    });
  }
};
