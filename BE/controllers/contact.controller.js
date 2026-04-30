const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODE_EMAIL,
    pass: process.env.NODE_PASSWORD,
  },
});

module.exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.NODE_EMAIL,
      subject: subject || "New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #007bff;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Contact Email Error:", error);
    return res.status(500).json({ message: "Failed to send email. Please try again later." });
  }
};
