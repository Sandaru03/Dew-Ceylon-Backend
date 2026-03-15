import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendBookingEmail = async (req, res) => {
  const { subject, body } = req.body;
  console.log("Email Request Received:", { subject });

  if (!subject || !body) {
    console.log("Missing subject or body");
    return res.status(400).json({ message: "Subject and body are required" });
  }

  try {
    console.log("Creating transporter with user:", process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: subject,
      text: body,
    };

    console.log("Sending mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("CRITICAL ERROR sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
