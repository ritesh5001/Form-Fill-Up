const Campaign = require('../models/Campaign');
const Template = require('../models/Template');
const EmailLog = require('../models/EmailLog');
const asyncHandler = require('../utils/asyncHandler');

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [sent, failed, campaigns, templates, recentLogs] = await Promise.all([
    EmailLog.countDocuments({ userId, status: 'sent' }),
    EmailLog.countDocuments({ userId, status: 'failed' }),
    Campaign.countDocuments({ userId }),
    Template.countDocuments({ userId }),
    EmailLog.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  res.status(200).json({
    cards: {
      totalSent: sent,
      totalFailed: failed,
      campaigns,
      templates,
    },
    recentLogs,
  });
});

module.exports = { getDashboard };
