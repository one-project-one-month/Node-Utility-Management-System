import { Resend } from 'resend';

export interface MailData {
  name: string;
  to: string;
  message?: string;
  htmlContent?: string;
  subject: string;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(mailData: MailData): Promise<void> {
  const { name, to, message, htmlContent, subject } = mailData;

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_USER || 'Acme <onboarding@resend.dev>',
      to,
      subject,
      text: `Dear ${name},\n\n${message || ''}\n\nBest regards,\nUtility Management Team`,
      html:
        htmlContent ||
        `<p>Dear ${name},</p><p>${message || ''}</p><p>Best regards,<br/>Utility Management Team</p>`,
    });

    console.log('✅ Email sent successfully:', response.data?.id);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}
