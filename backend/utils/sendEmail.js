import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP__HOST,
      port: Number(process.env.SMTP__PORT),
      secure: false,          // MUST be false for 587 port
      requireTLS: true,
      auth: {
        user: process.env.SMTP__USER,
        pass: process.env.SMTP__PASS
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    await transporter.sendMail({
      from: process.env.SMTP__FROM,
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
