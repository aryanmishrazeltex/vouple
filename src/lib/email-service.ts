import { Resend } from "resend";

export interface EmailSendResult {
  status: "sent" | "failed" | "unconfigured";
  providerMessageId?: string;
  error?: string;
}

export async function sendWaitlistConfirmationEmail(
  recipientEmail: string
): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "[Email Service] RESEND_API_KEY is not configured in server environment. Confirmation email was not sent."
    );
    return {
      status: "unconfigured",
      error: "RESEND_API_KEY environment variable is not configured.",
    };
  }

  const senderAddress = process.env.EMAIL_FROM || "Vouple <waitlist@vouple.in>";
  const resend = new Resend(apiKey);

  const plainTextContent = `Hi,

Thanks for your interest in Vouple.

You're on our waitlist for updates about our planned launch in Jabalpur, India.

We're building a dating experience centred on shared interests and clearly stated relationship intentions.

Vouple is still in development. Joining the waitlist does not create a dating account or guarantee access to the beta.

We'll email you when we have meaningful launch updates, in line with your consent preferences.

Thanks,
Team Vouple

---
Privacy Notice: https://vouple.in/privacy
To withdraw your consent or remove your address from our waitlist, reply to this email or contact privacy@vouple.in.`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You're on the Vouple waitlist</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fef9f2; margin: 0; padding: 40px 20px; color: #1d1b18; line-height: 1.6;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e6e2dc; border-radius: 16px; padding: 36px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    <div style="margin-bottom: 24px;">
      <span style="font-size: 24px; font-weight: 700; letter-spacing: -0.04em; color: #1d1b18;">vouple</span>
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #ff4f78; margin-left: 2px;"></span>
    </div>

    <p style="font-size: 16px; margin-top: 0;">Hi,</p>

    <p style="font-size: 16px;">Thanks for your interest in Vouple.</p>

    <p style="font-size: 16px;">You're on our waitlist for updates about our planned launch in Jabalpur, India.</p>

    <p style="font-size: 16px;">We're building a dating experience centred on shared interests and clearly stated relationship intentions.</p>

    <div style="background-color: #f8f3ed; border-left: 3px solid #b91348; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; font-size: 14px; color: #4b4549;">
        <strong>Notice:</strong> Vouple is still in development. Joining the waitlist does not create a dating account or guarantee access to the beta.
      </p>
    </div>

    <p style="font-size: 16px;">We'll email you when we have meaningful launch updates, in line with your consent preferences.</p>

    <p style="font-size: 16px; margin-bottom: 32px;">Thanks,<br><strong>Team Vouple</strong></p>

    <div style="border-top: 1px solid #ece7e1; padding-top: 20px; font-size: 12px; color: #7c7579;">
      <p style="margin: 0 0 8px 0;">
        <a href="https://vouple.in/privacy" style="color: #b91348; text-decoration: underline;">Privacy Notice</a> · Jabalpur Cohort № 001
      </p>
      <p style="margin: 0;">
        To withdraw your consent or remove your address from our waitlist at any time, reply directly to this email or write to <a href="mailto:privacy@vouple.in" style="color: #b91348;">privacy@vouple.in</a>.
      </p>
    </div>
  </div>
</body>
</html>
`;

  try {
    const { data, error } = await resend.emails.send({
      from: senderAddress,
      to: recipientEmail,
      subject: "You're on the Vouple waitlist",
      text: plainTextContent,
      html: htmlContent,
    });

    if (error) {
      console.error("[Email Service] Resend dispatch error:", error);
      return {
        status: "failed",
        error: `${error.name}: ${error.message}`,
      };
    }

    return {
      status: "sent",
      providerMessageId: data?.id,
    };
  } catch (err: any) {
    const msg = err?.message || "Unknown error during email dispatch";
    console.error("[Email Service] Unexpected exception:", msg);
    return {
      status: "failed",
      error: msg,
    };
  }
}
