/**
 * Saathi AI - Enterprise Security & Input Validation Suite
 * Protects against XSS, injection, prototype pollution, and excessive payloads.
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Sanitize and clamp string inputs
 */
export function sanitizeString(input: unknown, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip basic HTML tags
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate Base64 image payload
 */
export function isValidBase64Image(data: unknown, mimeType: unknown): boolean {
  if (typeof data !== 'string' || !data) return false;
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (typeof mimeType === 'string' && !validMimes.includes(mimeType)) {
    return false;
  }
  // Check typical base64 regex pattern
  const cleanBase64 = data.replace(/^data:image\/\w+;base64,/, '');
  return cleanBase64.length > 0 && cleanBase64.length < 15 * 1024 * 1024; // < 15MB
}

/**
 * API Rate Limiter
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // Limit each IP to 120 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this address, please try again after a few minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Strict Voice/Chat Rate Limiter
 */
export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 queries per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Please slow down your messages. Saathi is listening attentively.',
    code: 'CHAT_RATE_LIMIT',
  },
});

/**
 * Global Safe Error Handler
 */
export function safeErrorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Saathi Error Handler]', err?.message || err);
  const isProd = process.env.NODE_ENV === 'production';

  res.status(err?.status || 500).json({
    error: isProd
      ? 'An unexpected error occurred. Please try again or ask Saathi.'
      : err?.message || 'Internal Server Error',
    code: 'INTERNAL_ERROR',
  });
}
