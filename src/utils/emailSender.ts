import nodemailer from "nodemailer";
import { ENV } from "../config/env";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  attachments?: any[]
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Inventory System" <${ENV.EMAIL_USER}>`, 
      to, 
      subject,
      text, 
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
