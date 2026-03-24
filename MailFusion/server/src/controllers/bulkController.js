const csv = require('csv-parser');
const { Readable } = require('stream');
const Campaign = require('../models/Campaign');
const { emailQueue } = require('../queues/emailQueue');
const { getUserSettings } = require('../services/settingService');
const asyncHandler = require('../utils/asyncHandler');

const parseCsvBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const result = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => result.push(row))
      .on('end', () => resolve(result))
      .on('error', reject);
  });

const normalizeEmails = (input = []) => {
  return input
    .map((entry) => ({
      email: (entry.email || entry.to || '').trim(),
      name: (entry.name || '').trim(),
    }))
    .filter((entry) => entry.email);
};

const sendBulkEmail = asyncHandler(async (req, res) => {
  const { name, subject, message, delay, templateId, emailsText, emails } = req.body;
  const numericDelay = Number(delay || 1);

  let recipients = [];

  if (req.file?.buffer) {
    const rows = await parseCsvBuffer(req.file.buffer);
    recipients = normalizeEmails(rows);
  }

  if (emailsText) {
    const list = String(emailsText)
      .split(/[,\n]/)
      .map((email) => ({ email: email.trim(), name: '' }))
      .filter((item) => item.email);
    recipients = recipients.concat(list);
  }

  if (Array.isArray(emails)) {
    const list = normalizeEmails(emails);
    recipients = recipients.concat(list);
  }

  const uniqueMap = new Map();
  recipients.forEach((item) => {
    uniqueMap.set(item.email.toLowerCase(), item);
  });
  recipients = Array.from(uniqueMap.values());

  if (recipients.length === 0) {
    return res.status(400).json({ message: 'No recipients found' });
  }

  const settings = await getUserSettings(req.user.id);
  const effectiveDelay = numericDelay > 0 ? numericDelay : settings?.delay || 1;

  const campaign = await Campaign.create({
    name: name || `Campaign ${new Date().toISOString()}`,
    total: recipients.length,
    sent: 0,
    failed: 0,
    delay: effectiveDelay,
    status: 'pending',
    userId: req.user.id,
  });

  await Promise.all(
    recipients.map((recipient, index) =>
      emailQueue.add(
        'send-email',
        {
          userId: req.user.id,
          to: recipient.email,
          subject,
          body: message,
          templateId: templateId || null,
          variables: { name: recipient.name || '' },
          campaignId: campaign._id,
        },
        {
          delay: index * effectiveDelay * 1000,
          attempts: 1,
          removeOnComplete: true,
          removeOnFail: false,
        }
      )
    )
  );

  await Campaign.findByIdAndUpdate(campaign._id, { status: 'running' });

  return res.status(202).json({
    message: 'Bulk campaign queued',
    campaignId: campaign._id,
    total: recipients.length,
    delay: effectiveDelay,
  });
});

module.exports = { sendBulkEmail };
