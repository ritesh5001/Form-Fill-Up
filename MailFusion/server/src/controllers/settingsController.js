const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne({ userId: req.user.id });

  if (!settings) {
    settings = await Setting.create({ userId: req.user.id });
  }

  return res.status(200).json(settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  const payload = req.body;

  const settings = await Setting.findOneAndUpdate(
    { userId: req.user.id },
    { $set: payload },
    { new: true, upsert: true }
  );

  return res.status(200).json(settings);
});

module.exports = { getSettings, updateSettings };
