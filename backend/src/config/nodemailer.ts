/**
 * @module nodemailer
 *
 * Email transportation configuration service for Scoutify.
 * Configures Nodemailer to send transactional emails via SMTP in production,
 * falling back to stream logging in development environments.
 */

import nodemailer from 'nodemailer';
import logger from './logger.js';

const isProduction = process.env.NODE_ENV === 'production';
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = Number(process.env.SMTP_PORT) || 587;

/**
 * Creates and configures a Nodemailer Transporter instance based on environment variables.
 *
 * If SMTP credentials are absent or contain placeholder strings in development, initializes
 * a stream transport that logs email payloads instead of sending real network requests.
 *
 * @returns {nodemailer.Transporter} Configured Nodemailer transporter instance.
 */
export const createTransporter = () => {
  // Use mock stream transporter in development when credentials are unconfigured or placeholder
  if (!smtpUser || smtpUser.includes('your_email')) {
    logger.info('Nodemailer using development stream transporter (no real SMTP configured). Email contents will be logged.');
    return nodemailer.createTransport({
      streamTransport: true,
      newline: 'unix',
      buffer: true,
    });
  }

  // Create live SMTP transport connection
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

/** Pre-initialized singleton Nodemailer transporter for email dispatch. */
export const transporter = createTransporter();
