const EmailLog = require('../models/EmailLog');
const asyncHandler = require('../utils/asyncHandler');

const getHistory = asyncHandler(async (req, res) => {
  const { status, campaignId, fromDate, toDate, page = 1, limit = 20 } = req.query;

  const query = { userId: req.user.id };
  if (status) query.status = status;
  if (campaignId) query.campaignId = campaignId;

  if (fromDate || toDate) {
    query.createdAt = {};
    if (fromDate) query.createdAt.$gte = new Date(fromDate);
    if (toDate) query.createdAt.$lte = new Date(toDate);
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const skip = (numericPage - 1) * numericLimit;

  const [data, total] = await Promise.all([
    EmailLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(numericLimit).lean(),
    EmailLog.countDocuments(query),
  ]);

  res.status(200).json({
    data,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      pages: Math.ceil(total / numericLimit),
    },
  });
});

module.exports = { getHistory };
