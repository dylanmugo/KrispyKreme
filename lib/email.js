import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Krispy Kreme" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};
