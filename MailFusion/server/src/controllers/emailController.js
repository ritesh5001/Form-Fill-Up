const EmailLog = require('../models/EmailLog');
const { sendEmail } = require('../services/mailService');
const { getUserSettings } = require('../services/settingService');
const asyncHandler = require('../utils/asyncHandler');

const sendSingleEmail = asyncHandler(async (req, res) => {
  const { to, subject, message, fromEmail } = req.body;

  try {
    const settings = await getUserSettings(req.user.id);
    const { provider } = await sendEmail({ to, subject, body: message, fromEmail, settings });

    const log = await EmailLog.create({
      to,
      subject,
      body: message,
      status: 'sent',
      campaignId: null,
      userId: req.user.id,
      provider,
    });

    return res.status(200).json({ message: 'Email sent', log });
  } catch (error) {
    const log = await EmailLog.create({
      to,
      subject,
      body: message,
      status: 'failed',
      error: error.message,
      campaignId: null,
      userId: req.user.id,
    });

    return res.status(500).json({ message: 'Failed to send email', error: error.message, log });
  }
});

module.exports = { sendSingleEmail };
