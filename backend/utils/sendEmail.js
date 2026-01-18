/**
 * Send email using Brevo HTTP API
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: "LGC Concept AI",
          email: process.env.BREVO_SENDER_EMAIL
        },
        to: [{ email: to }],
        subject,
        htmlContent: html
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("EMAIL SEND ERROR:", error);
      throw new Error("Email sending failed");
    }
  } catch (err) {
    console.error("EMAIL SEND FAILED:", err);
    throw err;
  }
};

export default sendEmail;
