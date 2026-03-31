import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import studyReducer from '../../../../redux/study/studySlice';
import FlashcardView from '../FlashcardView';

const makeStore = (overrides = {}) =>
  configureStore({
    reducer: { study: studyReducer },
    preloadedState: {
      study: {
        queue: [],
        currentIndex: 0,
        isFlipped: false,
        isTransitioning: false,
        status: 'idle',
        error: null,
        ...overrides,
      },
    },
  });

const sampleCard = {
  id: '1',
  english: 'serendipity',
  vietnamese: 'sự tình cờ may mắn',
};

describe('FlashcardView', () => {
  it('renders nothing when card is null', () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <FlashcardView card={null} isTransitioning={false} />
      </Provider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders FlashcardFront content when card is provided and not flipped', () => {
    const store = makeStore({ isFlipped: false });
    render(
      <Provider store={store}>
        <FlashcardView card={sampleCard} isTransitioning={false} />
      </Provider>
    );
    expect(screen.getByText('ENGLISH')).toBeInTheDocument();
    expect(screen.getByText('serendipity')).toBeInTheDocument();
  });

  it('dispatches flipCard when clicked', () => {
    const store = makeStore({ isFlipped: false });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <FlashcardView card={sampleCard} isTransitioning={false} />
      </Provider>
    );

    fireEvent.click(screen.getByText('serendipity'));
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: 'study/flipCard' }));
  });
});
