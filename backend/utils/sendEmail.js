/**
 * Send email using Resend (HTTP-based)
 * Uses native fetch (Node.js 18+)
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "LGC Concept AI <onboarding@resend.dev>",
        to,
        subject,
        html
      })
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("EMAIL SEND ERROR:", error);
      throw new Error("Email sending failed");
    }
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    throw err;
  }
};

export default sendEmail;
