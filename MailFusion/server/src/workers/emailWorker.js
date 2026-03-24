const { Worker } = require('bullmq');
const { connection } = require('../queues/emailQueue');
const EmailLog = require('../models/EmailLog');
const Campaign = require('../models/Campaign');
const Template = require('../models/Template');
const { sendEmail } = require('../services/mailService');
const { getUserSettings } = require('../services/settingService');
const { applyVariables } = require('../utils/template');

const getFinalContent = async ({ templateId, subject, body, variables = {} }) => {
  if (!templateId) {
    return {
      finalSubject: applyVariables(subject || '', variables),
      finalBody: applyVariables(body || '', variables),
    };
  }

  const template = await Template.findById(templateId).lean();
  if (!template) {
    throw new Error('Template not found');
  }

  return {
    finalSubject: applyVariables(template.subject, variables),
    finalBody: applyVariables(template.body, variables),
  };
};

const updateCampaignProgress = async (campaignId, status) => {
  if (!campaignId) return;

  const update = status === 'sent' ? { $inc: { sent: 1 } } : { $inc: { failed: 1 } };
  await Campaign.findByIdAndUpdate(campaignId, update);

  const campaign = await Campaign.findById(campaignId).lean();
  if (!campaign) return;

  if (campaign.sent + campaign.failed >= campaign.total) {
    await Campaign.findByIdAndUpdate(campaignId, { status: 'completed' });
  } else if (campaign.status === 'pending') {
    await Campaign.findByIdAndUpdate(campaignId, { status: 'running' });
  }
};

const startEmailWorker = () => {
  const worker = new Worker(
    'email-jobs',
    async (job) => {
      const { userId, to, subject, body, templateId, variables, campaignId, fromEmail } = job.data;

      const { finalSubject, finalBody } = await getFinalContent({ templateId, subject, body, variables });
      const settings = await getUserSettings(userId);

      try {
        const { provider } = await sendEmail({
          to,
          subject: finalSubject,
          body: finalBody,
          fromEmail,
          settings,
        });

        await EmailLog.create({
          to,
          subject: finalSubject,
          body: finalBody,
          status: 'sent',
          error: '',
          campaignId: campaignId || null,
          userId,
          provider,
        });

        await updateCampaignProgress(campaignId, 'sent');
      } catch (error) {
        await EmailLog.create({
          to,
          subject: finalSubject || subject,
          body: finalBody || body,
          status: 'failed',
          error: error.message,
          campaignId: campaignId || null,
          userId,
        });

        await updateCampaignProgress(campaignId, 'failed');
      }
    },
    { connection }
  );

  worker.on('failed', (job, err) => {
    console.error(`Email job failed: ${job?.id}`, err.message);
  });

  worker.on('completed', (job) => {
    console.log(`Email job completed: ${job.id}`);
  });
};

module.exports = startEmailWorker;
