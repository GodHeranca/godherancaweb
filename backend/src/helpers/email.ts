import nodemailer from 'nodemailer';

interface SendMailParams {
  email: string;
  subject: string;
  body: string;
  successMessage?: string;
  errorMessage?: string;
}

export const sendMail = async ({
  email,
  subject,
  body,
  successMessage,
  errorMessage,
}: SendMailParams) => {
  // Send an email
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: body,
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log('Email sent:', info.response);
      return {
        status: 200,
        message: successMessage || 'Email sent successfully',
      };
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      return { status: 500, message: errorMessage || 'Failed to send email' };
    });
};
