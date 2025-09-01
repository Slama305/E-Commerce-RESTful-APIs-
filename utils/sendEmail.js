const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail service بدل host & port
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password بدون مسافات
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Failed to send email via Nodemailer:", error);
    throw new Error(`Nodemailer Error: ${error.message}`);
  }
};

module.exports = sendEmail;
