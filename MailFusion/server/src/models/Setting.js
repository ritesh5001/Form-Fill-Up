const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mailProvider: { type: String, enum: ['resend', 'sendgrid', 'smtp', 'nodemailer'], default: 'nodemailer' },
    fromEmail: { type: String, default: '' },
    delay: { type: Number, default: 1 },
    resendApiKey: { type: String, default: '' },
    sendgridApiKey: { type: String, default: '' },
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpSecure: { type: Boolean, default: false },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', settingSchema);
