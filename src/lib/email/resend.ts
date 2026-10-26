// Email sending system has been removed per user request.
// Reminders are handled via gentle in-app and dashboard wellness alerts.

interface SendPeriodReminderParams {
  to?: string;
  name?: string;
  predictedDate?: string;
  daysRemaining?: number;
  discreetMode?: boolean;
}

export async function sendPeriodReminderEmail({
  to,
  name,
  predictedDate,
  daysRemaining,
  discreetMode = false,
}: SendPeriodReminderParams = {}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Safe instant no-op: prevents any blocking HTTP requests or service timeouts
  return {
    success: true,
    messageId: "in_app_only",
  };
}
