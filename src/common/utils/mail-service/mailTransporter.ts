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
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: `Dear ${name},\n\n${message}\n\nBest regards,\nUtility Management Team`,
    html: htmlContent,
  };
  return mailOptions;
}

export async function mailTransporter(): Promise<nodemailer.Transporter> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
}
