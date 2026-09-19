import { describe, it, expect } from 'vitest';
import { generateFallbackExplanation } from '../server';

describe('Scam Shield & Threat Analysis Engine', () => {
  it('should detect high-risk threatening SMS with urgency and flag as danger', () => {
    const suspiciousMessage = 'URGENT: Your SBI account will be BLOCKED today. Click link bit.ly/3x8yz to update KYC immediately.';
    const result = generateFallbackExplanation(suspiciousMessage, 'en');

    expect(result.scamAnalysis.isSuspicious).toBe(true);
    expect(result.scamAnalysis.severity).toBe('danger');
    expect(result.scamAnalysis.warningSigns.length).toBeGreaterThan(0);
    expect(result.scamAnalysis.recommendedAction).toContain('Do not');
    expect(result.whatYouCanDo.length).toBeGreaterThan(0);
  });

  it('should detect Hindi fraud messages with account closure threats', () => {
    const hindiFraud = 'प्रिय ग्राहक, आपका बिजली बिल बकाया है, आज रात 9 बजे बिजली कनेक्शन काट दिया जाएगा। तुरंत कॉल करें।';
    const result = generateFallbackExplanation(hindiFraud, 'hi');

    expect(result.scamAnalysis.isSuspicious).toBe(true);
    expect(result.scamAnalysis.severity).toBe('danger');
    expect(result.documentType).toContain('संदिग्ध');
    expect(result.whatYouCanDo[0]).toContain('क्लिक न करें');
  });

  it('should classify routine bills as safe with no false positives', () => {
    const cleanNotice = 'Dear Consumer, your electricity bill of Rs 850 for June is generated. Due date is 25th June. Thank you.';
    const result = generateFallbackExplanation(cleanNotice, 'en');

    expect(result.scamAnalysis.isSuspicious).toBe(false);
    expect(result.scamAnalysis.severity).toBe('safe');
    expect(result.scamAnalysis.warningSigns).toHaveLength(0);
  });
});
