const mongoose = require('mongoose');
const env = require('./env');

const sanitizeMongoUri = (uri) => {
  if (!uri) return '(missing)';
  return uri.replace(/:\/\/([^:@/]+):([^@/]+)@/, '://$1:***@');
};

const connectDB = async () => {
  const mongoUri = env.MONGO_URI;

  if (env.NODE_ENV === 'production' && env.MONGO_URI_SOURCE === 'default-localhost') {
    throw new Error(
      [
        'MongoDB URI is not configured for production.',
        'Set one of these environment variables in Render: MONGO_URI, MONGODB_URI, or DATABASE_URL.',
      ].join(' ')
    );
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected using ${env.MONGO_URI_SOURCE}.`);
  } catch (error) {
    const details = [
      `Failed to connect to MongoDB using ${env.MONGO_URI_SOURCE}.`,
      `URI: ${sanitizeMongoUri(mongoUri)}`,
      `Cause: ${error.message}`,
    ];

    if (/mongodb\.net/i.test(mongoUri)) {
      details.push(
        'Atlas checklist: allow network access from 0.0.0.0/0 (or Render static egress IP), confirm DB user/password, and verify the cluster is running.'
      );
    }

    throw new Error(details.join(' '));
  }
};

module.exports = connectDB;
