import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FolderSection from '../FolderSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderSection = (props) =>
  render(
    <MemoryRouter>
      <FolderSection {...props} />
    </MemoryRouter>
  );

const sampleFolders = [
  { _id: 'f1', title: 'Folder A', flashcard_count: 20, due_count: 5 },
  { _id: 'f2', title: 'Folder B', flashcard_count: 10, due_count: 0 },
  { _id: 'f3', title: 'Folder C', flashcard_count: 15 }, // no due_count
];

beforeEach(() => {
  mockNavigate.mockClear();
});

describe('FolderSection', () => {
  it('renders "Your Folders" section title (Req 5)', () => {
    renderSection({ folders: sampleFolders, isLoading: false });
    expect(screen.getByText('Bộ thẻ của bạn')).toBeTruthy();
  });

  it('renders 3 skeleton placeholders when isLoading (Req 6.3)', () => {
    const { container } = renderSection({ folders: [], isLoading: true });
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBe(3);
  });

  it('renders all folders (Req 5.7)', () => {
    renderSection({ folders: sampleFolders, isLoading: false });
    expect(screen.getByText('Folder A')).toBeTruthy();
    expect(screen.getByText('Folder B')).toBeTruthy();
    expect(screen.getByText('Folder C')).toBeTruthy();
  });

  it('renders due/total label for each folder (Req 5.1)', () => {
    renderSection({ folders: sampleFolders, isLoading: false });
    expect(screen.getByText('5 thẻ chờ / 20 tổng')).toBeTruthy();
    expect(screen.getByText('0 thẻ chờ / 10 tổng')).toBeTruthy();
    expect(screen.getByText('0 thẻ chờ / 15 tổng')).toBeTruthy();
  });

  it('renders "Học bộ này" button only for folders with due > 0 (Req 5.4)', () => {
    renderSection({ folders: sampleFolders, isLoading: false });
    const buttons = screen.getAllByText('Học bộ này');
    expect(buttons.length).toBe(1);
  });

  it('"Học bộ này" navigates to /study?folderId={_id} (Req 5.5)', () => {
    renderSection({ folders: [sampleFolders[0]], isLoading: false });
    fireEvent.click(screen.getByText('Học bộ này'));
    expect(mockNavigate).toHaveBeenCalledWith('/study?folderId=f1');
  });

  it('sorts folders descending by due_count, folders without due_count sort last (Req 5.2)', () => {
    renderSection({ folders: sampleFolders, isLoading: false });
    const titles = screen.getAllByText(/Folder [ABC]/);
    // Folder A (due=5) first, Folder B (due=0) second, Folder C (no due_count → -1) last
    expect(titles[0].textContent).toBe('Folder A');
    expect(titles[1].textContent).toBe('Folder B');
    expect(titles[2].textContent).toBe('Folder C');
  });

  it('renders all folders even when all due_count === 0 (Req 5.7)', () => {
    const allZero = [
      { _id: 'x1', title: 'X1', flashcard_count: 5, due_count: 0 },
      { _id: 'x2', title: 'X2', flashcard_count: 8, due_count: 0 },
    ];
    renderSection({ folders: allZero, isLoading: false });
    expect(screen.getByText('X1')).toBeTruthy();
    expect(screen.getByText('X2')).toBeTruthy();
  });

  it('renders empty state gracefully with no folders', () => {
    renderSection({ folders: [], isLoading: false });
    expect(screen.getByText('Bộ thẻ của bạn')).toBeTruthy();
    expect(screen.queryByText('Học bộ này')).toBeNull();
  });
});
