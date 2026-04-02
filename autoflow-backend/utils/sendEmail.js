import nodemailer from "nodemailer";

let transporter;

export const sendEmail = async (to, subject, text, attachments = []) => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_EMAIL_PASSWORD) {
    console.log("Email credentials not configured. Email payload:", {
      to,
      subject,
      text,
      attachments,
    });
    return;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });
  }

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject,
    text,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};
