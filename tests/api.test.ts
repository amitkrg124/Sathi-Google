import { describe, it, expect } from 'vitest';
import { generateFallbackChat, generateFallbackExplanation, generateFallbackTaskPlan } from '../server';

describe('Saathi AI API & Core Services', () => {
  it('should generate respectful Hindi chat fallback with single-line takeaway', () => {
    const res = generateFallbackChat('बिजली का बिल कैसे भरें?', 'hi');
    expect(res).toBeDefined();
    expect(res.replyText).toContain('बिजली का बिल');
    expect(res.simplifiedKeyTakeaway).toBeDefined();
    expect(res.followUpSuggestions.length).toBeGreaterThan(0);
    expect(res.suggestedWorkflow).toBe('बिजली का बिल भरें');
  });

  it('should generate English chat response with proper guidance', () => {
    const res = generateFallbackChat('How do I pay my electricity bill?', 'en');
    expect(res).toBeDefined();
    expect(res.replyText).toContain('electricity bill');
    expect(res.simplifiedKeyTakeaway).toContain('Consumer Account Number');
    expect(res.followUpSuggestions).toContain('Help me pay my electricity bill');
  });

  it('should generate structured task plans with sensitive step flags', () => {
    const plan = generateFallbackTaskPlan('Pay Electricity Bill', 'en');
    expect(plan.title).toBe('Pay Electricity Bill');
    expect(plan.steps.length).toBeGreaterThanOrEqual(3);
    
    // Step with UPI PIN must be marked sensitive
    const pinStep = plan.steps.find((s) => s.title.toLowerCase().includes('pin') || s.instruction.toLowerCase().includes('pin'));
    expect(pinStep).toBeDefined();
    expect(pinStep?.isSensitive).toBe(true);
  });
});
