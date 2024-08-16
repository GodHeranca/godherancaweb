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
    service: 'Gmail', // Use your email service provider
    auth: {
      user: process.env.EMAIL, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: body,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      if (errorMessage) {
        return { status: 500, message: errorMessage };
      }
    }
    console.log('Email sent:', info.response);
    if (successMessage) {
      return { status: 200, message: successMessage };
    }
    return { status: 200, message: 'Email sent successfully' };
  });
};
