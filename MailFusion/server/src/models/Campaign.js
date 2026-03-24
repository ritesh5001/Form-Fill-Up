const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    total: { type: Number, required: true, default: 0 },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    delay: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
