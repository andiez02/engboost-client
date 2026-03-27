import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTimeRemaining } from '../formatTimeRemaining';

const NOW = new Date('2026-03-26T10:00:00.000Z');

describe('formatTimeRemaining', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns null for null input', () => {
    expect(formatTimeRemaining(null)).toBe(null);
  });

  it('returns null for undefined input', () => {
    expect(formatTimeRemaining(undefined)).toBe(null);
  });

  it('returns null for malformed string', () => {
    expect(formatTimeRemaining('not-a-date')).toBe(null);
  });

  it('returns "ngay bây giờ" for past timestamp', () => {
    const past = new Date(NOW.getTime() - 60_000);
    expect(formatTimeRemaining(past)).toBe('ngay bây giờ');
  });

  it('returns "ngay bây giờ" for exactly now', () => {
    expect(formatTimeRemaining(new Date(NOW))).toBe('ngay bây giờ');
  });

  it('returns "30 giây" for 30 seconds in the future', () => {
    const future = new Date(NOW.getTime() + 30_000);
    expect(formatTimeRemaining(future)).toBe('30 giây');
  });

  it('returns "1 phút 30 giây" for 90 seconds in the future', () => {
    const future = new Date(NOW.getTime() + 90_000);
    expect(formatTimeRemaining(future)).toBe('1 phút 30 giây');
  });

  it('returns "2 giờ" for 2 hours in the future', () => {
    const future = new Date(NOW.getTime() + 2 * 60 * 60 * 1000);
    expect(formatTimeRemaining(future)).toBe('2 giờ');
  });

  it('returns "2 ngày" for 2 days in the future', () => {
    const future = new Date(NOW.getTime() + 2 * 24 * 60 * 60 * 1000);
    expect(formatTimeRemaining(future)).toBe('2 ngày');
  });
});
