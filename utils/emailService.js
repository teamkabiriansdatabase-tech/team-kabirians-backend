const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendFreeClassNotification = async (leadData) => {
  const mailOptions = {
    from: `"Event Portal Alerts" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚨 New Free Class Registration: ${leadData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #1e3a8a; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">New Free Class Registration</h2>
        </div>
        <div style="padding: 24px; color: #334155; line-height: 1.6;">
          <p>A new visitor has submitted the Free Class form on the main website:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Phone:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">City / Area:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${leadData.city || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Date / Time:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};