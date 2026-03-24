require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5050),
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mailfusion',
  JWT_SECRET: process.env.JWT_SECRET || 'change_me_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  REDIS_URL: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  ENABLE_EMAIL_WORKER: process.env.ENABLE_EMAIL_WORKER === 'true',
  MAIL_PROVIDER: (process.env.MAIL_PROVIDER || 'nodemailer').toLowerCase(),
  DEFAULT_FROM_EMAIL: process.env.DEFAULT_FROM_EMAIL || 'noreply@mailfusion.local',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
};

module.exports = env;
