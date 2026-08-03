import nodemailer from 'nodemailer';
import logger from './logger.js';

const isProduction = process.env.NODE_ENV === 'production';
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT) || 587;

/**
 * Creates Nodemailer Transporter instance.
 * Uses configured SMTP options from process.env.
 */
export const createTransporter = () => {
  // If no real credentials are set in development, create a JSON transport or log warning
  if (!smtpUser || smtpUser.includes('your_email')) {
    logger.info('Nodemailer using development stream transporter (no real SMTP configured). Email contents will be logged.');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

export const transporter = createTransporter();
