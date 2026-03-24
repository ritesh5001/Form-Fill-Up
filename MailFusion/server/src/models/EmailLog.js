const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema(
  {
    to: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    status: { type: String, enum: ['sent', 'failed'], required: true },
    error: { type: String, default: '' },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmailLog', emailLogSchema);
