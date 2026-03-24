const Template = require('../models/Template');
const asyncHandler = require('../utils/asyncHandler');

const createTemplate = asyncHandler(async (req, res) => {
  const template = await Template.create({
    ...req.body,
    userId: req.user.id,
  });
  res.status(201).json(template);
});

const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(templates);
});

const updateTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );

  if (!template) {
    return res.status(404).json({ message: 'Template not found' });
  }

  return res.status(200).json(template);
});

const deleteTemplate = asyncHandler(async (req, res) => {
  const deleted = await Template.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

  if (!deleted) {
    return res.status(404).json({ message: 'Template not found' });
  }

  return res.status(200).json({ message: 'Template deleted' });
});

module.exports = { createTemplate, getTemplates, updateTemplate, deleteTemplate };
