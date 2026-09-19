import { describe, it, expect } from 'vitest';
import { sanitizeString, isValidBase64Image } from '../src/server/security';

describe('Security Suite & Input Sanitization', () => {
  it('should strip potentially malicious HTML/script tags from input', () => {
    const maliciousInput = '<script>alert("hack")</script>How do I pay my bill?';
    const clean = sanitizeString(maliciousInput, 500);

    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('</script>');
    expect(clean).toContain('How do I pay my bill?');
  });

  it('should clamp string length to specified maximum to prevent memory DOS', () => {
    const longString = 'A'.repeat(5000);
    const clamped = sanitizeString(longString, 100);

    expect(clamped.length).toBe(100);
  });

  it('should validate allowed image MIME types and base64 strings', () => {
    const validJpg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
    const invalidFormat = 'data:application/pdf;base64,JVBERi0xLjQK...';

    expect(isValidBase64Image(validJpg, 'image/jpeg')).toBe(true);
    expect(isValidBase64Image(invalidFormat, 'application/pdf')).toBe(false);
    expect(isValidBase64Image(null, 'image/jpeg')).toBe(false);
  });
});
