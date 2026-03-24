const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const env = require('../config/env');

const connection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const emailQueue = new Queue('email-jobs', { connection });

module.exports = { emailQueue, connection };
