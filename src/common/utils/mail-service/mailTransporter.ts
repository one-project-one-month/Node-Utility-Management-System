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
    host: 'smtp.gmail.com',
    port: 587, // Change from 465 to 587
    secure: false, // Must be false for port 587
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  try {
    await transporter.verify();
    console.log('mail server connection successful');
  } catch (error) {
    console.error('mail verification failed:', error);
    throw error;
  }

  return transporter;
}
