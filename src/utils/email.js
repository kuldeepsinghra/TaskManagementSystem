const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendTaskNotification = async (to, task) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `New Task Assigned: ${task.title}`,
    text: `You have been assigned a new task: "${task.title}"\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}\n\nPlease check your dashboard.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification email sent to:", to);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};
