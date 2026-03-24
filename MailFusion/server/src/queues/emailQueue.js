const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const env = require('../config/env');

let connection;
let emailQueue;

const getQueueConnection = () => {
  if (!connection) {
    connection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    // Handle connection errors to prevent noisy unhandled event logs.
    connection.on('error', () => {});
  }

  return connection;
};

const getEmailQueue = () => {
  if (!emailQueue) {
    emailQueue = new Queue('email-jobs', { connection: getQueueConnection() });
  }

  return emailQueue;
};

module.exports = { getEmailQueue, getQueueConnection };
