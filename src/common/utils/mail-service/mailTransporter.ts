import nodemailer from 'nodemailer';

export interface MailData {
  name: string;
  to: string;
  message?: string;
  htmlContent?: string;
  subject: string;
}

export async function mailOptionConfig(
  mailData: MailData
): Promise<nodemailer.SendMailOptions> {
  const { name, to, message, subject, htmlContent } = mailData;
  const mailOptions = {
    from: 'nestflowums@resend.dev',
    to: to,
    subject: subject,
    text: `Dear ${name},\n\n${message}\n\nBest regards,\nUtility Management Team`,
    html: htmlContent,
  };
  return mailOptions;
}

export async function mailTransporter(): Promise<nodemailer.Transporter> {
  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.RESEND_API_KEY,
    },
  });

  try {
    await transporter.verify();
    console.log('SMTP server connection successful');
  } catch (error) {
    console.error('SMTP verification failed:', error);
    throw error;
  }

  return transporter;
}
