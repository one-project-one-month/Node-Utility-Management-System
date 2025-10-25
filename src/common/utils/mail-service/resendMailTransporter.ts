import { Resend } from 'resend';

export interface MailData {
  name: string;
  to: string;
  message?: string;
  htmlContent?: string;
  subject: string;
}
export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export function mailOptionConfig(mailData: MailData): MailOptions {
  const { name, to, message, subject, htmlContent } = mailData;
  const mailOptions = {
    from: 'nestflowums@resend.dev',
    to: to,
    subject: subject,
    text: `Dear ${name},\n\n${message}\n\nBest regards,\nNest Flow`,
    html: htmlContent,
  };
  return mailOptions;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function mailSend(mailConfig: MailOptions) {
  try {
    const info = await resend.emails.send(mailConfig);
    console.log('Mail successfully sent: ', info.data?.id);
    return info.data;
  } catch (error) {
    console.error('Mail sent failed: ', error);
    throw error;
  }
}
