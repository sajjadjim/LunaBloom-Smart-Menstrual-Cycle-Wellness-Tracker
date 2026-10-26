import { Resend } from "resend";
import { renderPeriodReminderEmailHtml } from "./templates";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const defaultFrom = process.env.EMAIL_FROM || "LunaBloom <reminders@lunabloom.app>";

interface SendPeriodReminderParams {
  to: string;
  name: string;
  predictedDate: string;
  daysRemaining: number;
  discreetMode?: boolean;
}

export async function sendPeriodReminderEmail({
  to,
  name,
  predictedDate,
  daysRemaining,
  discreetMode = false,
}: SendPeriodReminderParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const subject = discreetMode
    ? "🌸 A Gentle Wellness Reminder From LunaBloom"
    : "🌸 A Gentle Reminder From LunaBloom";

  const appUrl = process.env.APP_URL || "https://lunabloom.app";
  const html = renderPeriodReminderEmailHtml({
    name,
    predictedDate,
    daysRemaining,
    discreetMode,
    appUrl,
  });

  if (!resend) {
    console.info(
      `[DEV / SIMULATION] Resend API key not set. Email would be sent to: ${to} (Subject: ${subject})`
    );
    return {
      success: true,
      messageId: `simulated_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Exception sending email with Resend:", message);
    return { success: false, error: message };
  }
}
