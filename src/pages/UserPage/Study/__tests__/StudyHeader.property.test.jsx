import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import * as fc from 'fast-check';
import studyReducer from '../../../../redux/study/studySlice';
import StudyHeader from '../components/layout/StudyHeader';

// Feature: flashcard-ui-upgrade, Property 6: StudyHeader progress format

function makeStore(currentIndex, total) {
  // Build a queue array of the required length (minimal card objects)
  const queue = Array.from({ length: total }, (_, i) => ({
    id: String(i),
    english: 'word',
    vietnamese: 'nghĩa',
  }));
  return configureStore({
    reducer: { study: studyReducer },
    preloadedState: {
      study: {
        queue,
        currentIndex,
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
        unlockedAchievements: [],
        xpGained: 0,
        leveledUp: false,
        newLevel: null,
        completedChallenges: [],
      },
    },
  });
}

describe('Property 6: StudyHeader progress format', () => {
  it('displays "{min(currentIndex+1, total)} / {total}" for any valid state', () => {
    // Validates: Requirements 3.1, 3.4
    fc.assert(
      fc.property(
        fc.tuple(fc.nat(50), fc.nat(50)).map(([idx, extra]) => ({
          currentIndex: idx,
          total: idx + extra,
        })),
        ({ currentIndex, total }) => {
          const store = makeStore(currentIndex, total);
          const expectedCurrent = Math.min(currentIndex + 1, total);
          const expectedText = `${expectedCurrent} / ${total}`;

          const { container, unmount } = render(
            <Provider store={store}>
              <StudyHeader folderName="Test" onLeave={() => {}} />
            </Provider>
          );

          expect(container.textContent).toContain(expectedText);
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('displays "0 / 0" when total is 0', () => {
    // Validates: Requirement 3.4
    const store = makeStore(0, 0);
    const { container } = render(
      <Provider store={store}>
        <StudyHeader folderName="Test" onLeave={() => {}} />
      </Provider>
    );
    expect(container.textContent).toContain('0 / 0');
  });
});
