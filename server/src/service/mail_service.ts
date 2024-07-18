import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = (email: string, token: string) => {
  const url = `${process.env.BASE_URL}/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<h3>Click <a href="${url}">here</a> to verify your email.</h3>`,
  };
  transporter.sendMail(mailOptions);
};
