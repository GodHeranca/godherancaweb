import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or any other service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  // const verificationLink = `${process.env.NEXT_PUBLIC_API_URL}/verify-email?token=${token}`;
  const verificationMessage = `Your verification code is: ${token}`;


  // await transporter.sendMail({
  //   from: 'no-reply@godheranca.com',
  //   to: email,
  //   subject: 'Email Verification',
  //   html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
  // });
  await transporter.sendMail({
    from: 'godheranca@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: verificationMessage,
  });

};
