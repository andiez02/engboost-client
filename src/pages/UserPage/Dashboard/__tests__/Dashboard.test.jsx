import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import studyReducer from '../../../../redux/study/studySlice';
import folderReducer from '../../../../redux/folder/folderSlice';
import { userReducer } from '../../../../redux/user/userSlice';
import Dashboard from '../Dashboard';

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

// Mock heavy layout components that are irrelevant to command center tests
vi.mock('../../../../components/Layout/SideBar', () => ({ default: () => <div data-testid="sidebar" /> }));
vi.mock('../../../../components/Layout/HeaderUser', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../../../../components/UserFlashcard/UserFlashcardOverview', () => ({ default: () => <div /> }));
vi.mock('../../../../components/LearningProgress/LearningProgress', () => ({ default: () => <div /> }));

// Mock the thunks so we can track dispatches without hitting the network
vi.mock('../../../../redux/study/studySlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchStats: vi.fn(() => ({ type: 'study/fetchStats/pending', payload: undefined })),
  };
});

vi.mock('../../../../redux/folder/folderSlice', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    fetchFolders: vi.fn(() => ({ type: 'folders/fetchFolders/pending', payload: undefined })),
  };
});

import { fetchStats } from '../../../../redux/study/studySlice';
import { fetchFolders } from '../../../../redux/folder/folderSlice';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const makeStore = (studyOverrides = {}, foldersOverrides = {}) =>
  configureStore({
    reducer: { user: userReducer, study: studyReducer, folders: folderReducer },
    preloadedState: {
      user: { currentUser: null },
      study: {
        queue: [],
        currentIndex: 0,
        isFlipped: false,
        isLoading: false,
        isSubmitting: false,
        isTransitioning: false,
        error: null,
        stats: null,
        sessionDone: false,
        reviewedCount: 0,
        correctCount: 0,
        sessionStartTime: null,
        reinsertCount: {},
        nextReviewAt: null,
        ...studyOverrides,
      },
      folders: {
        folders: [],
        publicFolders: [],
        isLoading: false,
        error: null,
        selectedFolder: null,
        ...foldersOverrides,
      },
    },
  });

const renderDashboard = (store) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </Provider>
  );

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Dashboard data-fetching on mount', () => {
  it('dispatches fetchStats on mount (Req 6.1)', () => {
    const store = makeStore();
    renderDashboard(store);
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });

  it('dispatches fetchFolders on mount (Req 6.2)', () => {
    const store = makeStore();
    renderDashboard(store);
    expect(fetchFolders).toHaveBeenCalledTimes(1);
  });

  it('does not re-fetch on re-render (Req 6.5)', () => {
    const store = makeStore();
    const { rerender } = renderDashboard(store);
    rerender(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    // fetchStats and fetchFolders should still only be called once
    expect(fetchStats).toHaveBeenCalledTimes(1);
    expect(fetchFolders).toHaveBeenCalledTimes(1);
  });
});

describe('Dashboard auto-refresh', () => {
  it('re-dispatches fetchStats after 60 seconds (Req 7.1)', () => {
    const store = makeStore();
    renderDashboard(store);
    expect(fetchStats).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    expect(fetchStats).toHaveBeenCalledTimes(2);
  });

  it('clears auto-refresh interval on unmount (Req 7.2)', () => {
    const store = makeStore();
    const { unmount } = renderDashboard(store);
    unmount();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    // fetchStats should not be called again after unmount
    expect(fetchStats).toHaveBeenCalledTimes(1);
  });
});

describe('Dashboard skeleton loading (Req 6.3)', () => {
  it('renders skeleton placeholders while isLoading is true', () => {
    const store = makeStore({ isLoading: true });
    const { container } = renderDashboard(store);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('Dashboard Primary_Action_Block update after auto-refresh (Req 7.3)', () => {
  it('shows Study Now button after auto-refresh returns due > 0', async () => {
    // Start with stats = null (loading state), then simulate fulfilled fetchStats
    const store = makeStore({ isLoading: false, stats: { due: 0, reviewedToday: 0 } });
    renderDashboard(store);

    // Simulate Redux state update as if fetchStats returned due > 0
    act(() => {
      store.dispatch({
        type: 'study/fetchStats/fulfilled',
        payload: { due: 5, reviewedToday: 2, nextReviewAt: null },
      });
    });

    expect(screen.getByText('Học ngay — 5 thẻ')).toBeTruthy();
  });
});
