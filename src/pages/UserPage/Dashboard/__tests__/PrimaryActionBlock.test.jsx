import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrimaryActionBlock from '../PrimaryActionBlock';
import { formatTimeRemaining } from '../../../../utils/formatTimeRemaining';

// Mock useNavigate at the top level
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

// Helper to render with router context
const renderBlock = (props) =>
  render(
    <MemoryRouter>
      <PrimaryActionBlock {...props} />
    </MemoryRouter>
  );

const defaultProps = {
  due: 0,
  nextReviewAt: null,
  isLoading: false,
  error: null,
  onRetry: vi.fn(),
};

beforeEach(() => {
  mockNavigate.mockClear();
});

// ─── Property 1 ──────────────────────────────────────────────────────────────
// Feature: dashboard-command-center, Property 1: Study Now block correctness
describe('Property 1: Study Now block correctness', () => {
  it('renders Study Now button with due count and no caught-up message for any due > 0', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (due) => {
          const { unmount } = renderBlock({ ...defaultProps, due });
          expect(screen.getByText(`Học ngay — ${due} thẻ chờ`)).toBeTruthy();
          expect(screen.queryByText(/hoàn thành rồi/i)).toBeNull();
          unmount();
        }
      )
    );
  });
});

// ─── Property 2 ──────────────────────────────────────────────────────────────
// Feature: dashboard-command-center, Property 2: Caught-up next review label
describe('Property 2: Caught-up next review label', () => {
  it('renders "Next review in {timeRemaining}" for any future nextReviewAt when due === 0', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date(Date.now() + 60_000), max: new Date(Date.now() + 365 * 24 * 3600 * 1000) }),
        (date) => {
          // Skip invalid dates that fast-check may generate
          if (isNaN(date.getTime())) return;
          const nextReviewAt = date.toISOString();
          const expected = formatTimeRemaining(nextReviewAt);
          // Only test when formatTimeRemaining returns a non-null, non-"ngay bây giờ" value
          if (!expected || expected === 'ngay bây giờ') return;

          const { unmount } = renderBlock({ ...defaultProps, due: 0, nextReviewAt });
          expect(screen.getByText(new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeTruthy();
          unmount();
        }
      )
    );
  });
});

// ─── Unit Tests ───────────────────────────────────────────────────────────────
describe('PrimaryActionBlock unit tests', () => {
  it('due === 0 renders "You\'re all caught up!" (Req 2.1)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    expect(screen.getByText(/Bạn đã hoàn thành rồi/i)).toBeTruthy();
  });

  it('due === 0 renders "Tạo thẻ mới" button (Req 2.3)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    expect(screen.getByText(/Tạo thẻ mới/i)).toBeTruthy();
  });

  it('due === 0 renders "Ôn thẻ khó" button (Req 2.4)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    expect(screen.getByText(/Ôn thẻ khó/i)).toBeTruthy();
  });

  it('nextReviewAt === null and due === 0 → "Next review in" label absent (Req 2.5)', () => {
    renderBlock({ ...defaultProps, due: 0, nextReviewAt: null });
    expect(screen.queryByText(/Ôn lại sau/i)).toBeNull();
  });

  it('due === 0 → "Học ngay" button absent (Req 2.6)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    expect(screen.queryByText(/Học ngay/i)).toBeNull();
  });

  it('error state → error banner + retry button shown (Req 6.4)', () => {
    renderBlock({ ...defaultProps, error: 'Some error' });
    expect(screen.getByText(/Không thể tải dữ liệu/i)).toBeTruthy();
    expect(screen.getByText('Thử lại')).toBeTruthy();
  });

  it('retry button calls onRetry (Req 6.4)', () => {
    const onRetry = vi.fn();
    renderBlock({ ...defaultProps, error: 'Some error', onRetry });
    fireEvent.click(screen.getByText('Thử lại'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('isLoading renders skeleton placeholders (Req 6.3)', () => {
    const { container } = renderBlock({ ...defaultProps, isLoading: true });
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(2);
  });

  it('Study Now button click navigates to /study (Req 1.2)', () => {
    renderBlock({ ...defaultProps, due: 5 });
    fireEvent.click(screen.getByText('Học ngay — 5 thẻ chờ'));
    expect(mockNavigate).toHaveBeenCalledWith('/study');
  });

  it('due > 0 → "caught up" message absent (Req 1.4)', () => {
    renderBlock({ ...defaultProps, due: 3 });
    expect(screen.queryByText(/hoàn thành rồi/i)).toBeNull();
  });

  it('nextReviewAt non-null and due === 0 → "Next review in" label present (Req 2.2)', () => {
    const future = new Date(Date.now() + 3600_000).toISOString();
    renderBlock({ ...defaultProps, due: 0, nextReviewAt: future });
    expect(screen.getByText(/Ôn lại sau/i)).toBeTruthy();
  });

  it('"Tạo thẻ mới" button navigates to /flashcard/discover (Req 2.3)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    fireEvent.click(screen.getByText(/Tạo thẻ mới/i));
    expect(mockNavigate).toHaveBeenCalledWith('/flashcard/discover');
  });

  it('"Ôn thẻ khó" button navigates to /study?mode=weak (Req 2.4)', () => {
    renderBlock({ ...defaultProps, due: 0 });
    fireEvent.click(screen.getByText(/Ôn thẻ khó/i));
    expect(mockNavigate).toHaveBeenCalledWith('/study?mode=weak');
  });
});
