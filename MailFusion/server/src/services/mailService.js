const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const sgMail = require('@sendgrid/mail');
const env = require('../config/env');

const getProviderConfig = (settings) => {
  const provider = (settings?.mailProvider || env.MAIL_PROVIDER || 'nodemailer').toLowerCase();

  return {
    provider,
    fromEmail: settings?.fromEmail || env.DEFAULT_FROM_EMAIL,
    resendApiKey: settings?.resendApiKey || env.RESEND_API_KEY,
    sendgridApiKey: settings?.sendgridApiKey || env.SENDGRID_API_KEY,
    smtpHost: settings?.smtpHost || env.SMTP_HOST,
    smtpPort: Number(settings?.smtpPort || env.SMTP_PORT),
    smtpSecure: Boolean(settings?.smtpSecure ?? env.SMTP_SECURE),
    smtpUser: settings?.smtpUser || env.SMTP_USER,
    smtpPass: settings?.smtpPass || env.SMTP_PASS,
  };
};

const sendWithResend = async ({ to, subject, html, text, fromEmail, apiKey }) => {
  if (!apiKey) throw new Error('Resend API key missing');
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
    text,
  });
};

const sendWithSendgrid = async ({ to, subject, html, text, fromEmail, apiKey }) => {
  if (!apiKey) throw new Error('Sendgrid API key missing');
  sgMail.setApiKey(apiKey);
  await sgMail.send({
    to,
    from: fromEmail,
    subject,
    html,
    text,
  });
};

const sendWithSmtp = async ({ to, subject, html, text, config, fromEmail }) => {
  if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
    throw new Error('SMTP settings are incomplete');
  }

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    text,
    html,
  });
};

const sendEmail = async ({ to, subject, body, fromEmail, settings }) => {
  const config = getProviderConfig(settings);
  const finalFrom = fromEmail || config.fromEmail;
  const html = body;
  const text = body.replace(/<[^>]+>/g, '');

  if (!to || !subject || !body) {
    throw new Error('to, subject and body are required');
  }

  if (config.provider === 'resend') {
    await sendWithResend({ to, subject, html, text, fromEmail: finalFrom, apiKey: config.resendApiKey });
  } else if (config.provider === 'sendgrid') {
    await sendWithSendgrid({ to, subject, html, text, fromEmail: finalFrom, apiKey: config.sendgridApiKey });
  } else {
    await sendWithSmtp({ to, subject, html, text, config, fromEmail: finalFrom });
  }

  return { provider: config.provider, fromEmail: finalFrom };
};

module.exports = { sendEmail, getProviderConfig };
