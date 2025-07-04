import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Lawsuits Admin" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
