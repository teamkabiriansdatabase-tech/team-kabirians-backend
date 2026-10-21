// backend/models/FreeClassLead.js
const mongoose = require('mongoose');

const freeClassLeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String },
    interests: [{ type: String }],
    emailSentToAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FreeClassLead', freeClassLeadSchema);