import React from "react";

interface PeriodReminderEmailProps {
  name: string;
  predictedDate: string;
  daysRemaining: number;
  discreetMode?: boolean;
  appUrl?: string;
}

export function renderPeriodReminderEmailHtml({
  name,
  predictedDate,
  daysRemaining,
  discreetMode = false,
  appUrl = "https://lunabloom.app",
}: PeriodReminderEmailProps): string {
  const greeting = name ? `Hi ${name} 💗` : "Hello 💗";

  if (discreetMode) {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Gentle Reminder From LunaBloom</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF7FB; margin: 0; padding: 24px; color: #3F243A;">
        <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 32px; border: 1px solid #FCE7F3; box-shadow: 0 4px 20px rgba(244, 114, 182, 0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 24px; font-weight: 700; color: #BE185D;">LunaBloom 🌸</span>
          </div>
          <h2 style="font-size: 20px; font-weight: 600; color: #3F243A; margin-bottom: 16px;">${greeting}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #5C3A55;">
            This is a gentle scheduled reminder from your personal wellness journal for <strong>${predictedDate}</strong>.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #5C3A55;">
            Take a moment today to rest, stay hydrated, and take gentle care of your wellbeing.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${appUrl}/dashboard" style="background-color: #BE185D; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">Open LunaBloom</a>
          </div>
          <hr style="border: none; border-top: 1px solid #FCE7F3; margin: 24px 0;" />
          <p style="font-size: 12px; color: #8E6E87; text-align: center;">
            You are receiving this notification according to your reminder preferences.
            <a href="${appUrl}/settings" style="color: #BE185D; text-decoration: underline;">Manage preferences</a>.
          </p>
        </div>
      </body>
    </html>
    `;
  }

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>A Gentle Reminder From LunaBloom</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF7FB; margin: 0; padding: 24px; color: #3F243A;">
      <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 36px; border: 1px solid #FCE7F3; box-shadow: 0 4px 20px rgba(244, 114, 182, 0.08);">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 26px; font-weight: 700; color: #BE185D;">LunaBloom 🌸</span>
          <div style="font-size: 12px; color: #8E6E87; margin-top: 4px;">Your Cycle, Your Comfort, Your Confidence.</div>
        </div>

        <h2 style="font-size: 20px; font-weight: 600; color: #3F243A; margin-bottom: 12px;">${greeting}</h2>

        <p style="font-size: 15px; line-height: 1.6; color: #5C3A55; margin-bottom: 16px;">
          Your next period is estimated to begin around <strong>${predictedDate}</strong> (in approximately ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}).
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #5C3A55; margin-bottom: 20px;">
          It's a good time to prepare a few essentials and take extra care of yourself.
        </p>

        <div style="background-color: #FFF7FB; border-radius: 16px; padding: 20px; border: 1px solid #FCE7F3; margin-bottom: 24px;">
          <h3 style="font-size: 15px; font-weight: 600; color: #BE185D; margin: 0 0 12px 0;">
            🌸 Your Period Preparation Checklist:
          </h3>
          <ul style="list-style-type: none; padding-left: 0; margin: 0; font-size: 14px; line-height: 2; color: #3F243A;">
            <li>✓ Keep your preferred menstrual products ready.</li>
            <li>✓ Carry a spare product when going out.</li>
            <li>✓ Stay hydrated throughout the day.</li>
            <li>✓ Prepare comfortable clothing.</li>
            <li>✓ Keep a heating pad available if helpful.</li>
            <li>✓ Make time for rest when needed.</li>
          </ul>
        </div>

        <p style="font-size: 13px; font-style: italic; color: #8E6E87; margin-bottom: 24px; text-align: center;">
          Remember, your predicted date is an estimate based on your cycle history.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/dashboard" style="background-color: #BE185D; color: #ffffff; padding: 13px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 15px; display: inline-block;">
            View LunaBloom Dashboard
          </a>
        </div>

        <div style="text-align: center; margin-top: 28px; font-size: 14px; color: #5C3A55;">
          Take care,<br />
          <strong>The LunaBloom Team 🌸</strong>
        </div>

        <hr style="border: none; border-top: 1px solid #FCE7F3; margin: 28px 0;" />

        <p style="font-size: 12px; color: #8E6E87; text-align: center; line-height: 1.5;">
          LunaBloom respects your privacy. You can adjust your notification frequency or switch to discreet notification mode anytime in your
          <a href="${appUrl}/settings" style="color: #BE185D; text-decoration: underline;">Notification Settings</a>.
        </p>
      </div>
    </body>
  </html>
  `;
}
