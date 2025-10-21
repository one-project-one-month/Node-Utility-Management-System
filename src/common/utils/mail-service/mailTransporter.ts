import nodemailer from 'nodemailer';

export interface MailData {
  name: string;
  to: string;
  message?: string;
  htmlContent?: string;
  subject: string;
}

export async function mailTransporter(
  mailData: MailData
): Promise<[nodemailer.Transporter, nodemailer.SendMailOptions]> {
  const { name, to, message, subject, htmlContent } = mailData;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_HOST,
    to: to,
    subject: subject,
    text: `Dear ${name},\n\n${message}\n\nBest regards,\nUtility Management Team`,
    html: htmlContent,
  };

  return [transporter, mailOptions];
}
