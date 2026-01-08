import nodemailer from "nodemailer";

/**
 * Send email using free SMTP 
 * Caller controls subject & html
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    throw err;
  }
};

export default sendEmail;
