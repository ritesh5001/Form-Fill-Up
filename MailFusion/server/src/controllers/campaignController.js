const Campaign = require('../models/Campaign');
const asyncHandler = require('../utils/asyncHandler');

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(campaigns);
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findOne({ _id: req.params.id, userId: req.user.id });
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  return res.status(200).json(campaign);
});

module.exports = { getCampaigns, getCampaignById };
