const Setting = require('../models/Setting');

const getUserSettings = async (userId) => {
  const settings = await Setting.findOne({ userId }).lean();
  return settings;
};

module.exports = { getUserSettings };
