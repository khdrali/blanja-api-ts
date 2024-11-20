import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (
  email: string,
  subject: string,
  message: string
) => {
  try {
    const trasporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "khaidarali48@gmail.com",
        pass: "coog efmw lpsy sdne",
      },
    });
    const mailOptions = {
      from: "khaidarali48@gmail.com",
      to: email,
      subject: subject,
      text: message,
    };
    await trasporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email sending failed");
  }
};
