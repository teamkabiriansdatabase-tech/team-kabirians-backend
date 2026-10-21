const FreeClassLead = require('../models/FreeClassLead');
const { sendFreeClassNotification } = require('../utils/emailService');

exports.submitFreeClassLead = async (req, res) => {
  try {
    const { name, email, phone, city, interests } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone number are required',
      });
    }

    // 1. Save Lead to MongoDB
    const lead = await FreeClassLead.create({
      name,
      email,
      phone,
      city,
      interests: Array.isArray(interests) ? interests : [],
      emailSentToAdmin: false,
    });

    // 2. Dispatch Email asynchronously
    try {
      if (process.env.SMTP_USER && process.env.ADMIN_EMAIL) {
        await sendFreeClassNotification(lead);
        lead.emailSentToAdmin = true;
        await lead.save();
      }
    } catch (mailError) {
      console.error('Email dispatch failed, but lead was saved:', mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your registration for the free class has been received.',
      data: { id: lead._id, name: lead.name },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};